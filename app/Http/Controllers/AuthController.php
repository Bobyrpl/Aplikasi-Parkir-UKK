<?php

namespace App\Http\Controllers;

use App\Models\LogAktivitas;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * POST /api/register
     * Registrasi akun baru (publik, tidak perlu login).
     * Role otomatis "petugas" — role tidak boleh dipilih sendiri oleh
     * pengguna demi keamanan (admin/owner cuma boleh dibuat oleh admin
     * lewat menu Kelola User).
     * Passkey langsung digenerate saat registrasi supaya bisa
     * ditampilkan ke user (buat auto-login lain kali).
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama_lengkap' => 'required|string|max:50',
            'username'     => 'required|string|max:50|unique:tb_user,username',
            'no_telp'      => 'required|string|max:20|unique:tb_user,no_telp',
            'password'     => 'required|string|min:6|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Data tidak valid',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $user = User::create([
            'nama_lengkap' => $request->nama_lengkap,
            'username'     => $request->username,
            'no_telp'      => $request->no_telp,
            'password'     => $request->password, // otomatis ke-hash (cast 'hashed')
            'role'         => 'petugas',
            'status_aktif' => true,
        ]);

        $token = $user->createToken('token-' . $user->username)->plainTextToken;

        // Generate passkey langsung saat register (bukan cuma pas login)
        $passkey = $this->buatPasskeyBaru($user);

        LogAktivitas::catat($user->id_user, 'Registrasi akun baru sebagai ' . $user->role);

        return response()->json([
            'message' => 'Registrasi berhasil',
            'user'    => [
                'id_user'      => $user->id_user,
                'nama_lengkap' => $user->nama_lengkap,
                'username'     => $user->username,
                'no_telp'      => $user->no_telp,
                'role'         => $user->role,
            ],
            'token'         => $token,
            'passkey_token' => $passkey,
        ], 201);
    }

    /**
     * POST /api/login
     * Login pakai username & password (bukan email).
     * Semua role (admin, petugas, owner) lewat endpoint yang sama.
     * Setelah berhasil, generate passkey_token baru (buat auto-login
     * di kunjungan berikutnya lewat endpoint /api/login-passkey).
     */
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Data tidak valid',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $user = User::where('username', $request->username)->first();

        // Cek user ada, password cocok, dan akun masih aktif
        if (! $user || ! Auth::attempt($request->only('username', 'password'))) {
            return response()->json([
                'message' => 'Username atau password salah',
            ], 401);
        }

        if (! $user->status_aktif) {
            return response()->json([
                'message' => 'Akun anda nonaktif, hubungi admin',
            ], 403);
        }

        // Buat token Sanctum baru untuk user ini
        $token = $user->createToken('token-' . $user->username)->plainTextToken;

        // Buat & simpan passkey baru (dipakai buat auto-login lain kali)
        $passkey = $this->buatPasskeyBaru($user);

        // Catat ke log aktivitas
        LogAktivitas::catat($user->id_user, 'Login sebagai ' . $user->role);

        return response()->json([
            'message' => 'Login berhasil',
            'user'    => [
                'id_user'      => $user->id_user,
                'nama_lengkap' => $user->nama_lengkap,
                'username'     => $user->username,
                'role'         => $user->role,
            ],
            'token'         => $token,
            'passkey_token' => $passkey,
        ], 200);
    }

    /**
     * POST /api/login-passkey
     * Auto-login pakai passkey_token yang tersimpan di localStorage
     * frontend, jadi user tidak perlu ketik username/password lagi
     * selama passkey masih valid. Passkey lama otomatis diganti
     * dengan yang baru tiap dipakai (rotasi, biar lebih aman).
     */
    public function loginWithPasskey(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'passkey_token' => 'required|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Data tidak valid',
                'errors'  => $validator->errors(),
            ], 422);
        }

        $user = User::where('passkey_token', $request->passkey_token)->first();

        if (! $user || ! $user->status_aktif) {
            return response()->json([
                'message' => 'Passkey tidak valid, silakan login ulang',
            ], 401);
        }

        $token = $user->createToken('token-' . $user->username)->plainTextToken;

        // Rotasi passkey supaya token lama tidak bisa dipakai lagi
        $passkeyBaru = $this->buatPasskeyBaru($user);

        LogAktivitas::catat($user->id_user, 'Login otomatis (passkey) sebagai ' . $user->role);

        return response()->json([
            'message' => 'Login berhasil',
            'user'    => [
                'id_user'      => $user->id_user,
                'nama_lengkap' => $user->nama_lengkap,
                'username'     => $user->username,
                'role'         => $user->role,
            ],
            'token'         => $token,
            'passkey_token' => $passkeyBaru,
        ], 200);
    }

    /**
     * POST /api/logout
     * Menghapus token yang sedang dipakai (harus sudah login/auth:sanctum).
     * Passkey ikut dihapus supaya perangkat ini tidak auto-login lagi.
     */
    public function logout(Request $request)
    {
        $user = $request->user();

        LogAktivitas::catat($user->id_user, 'Logout dari sistem');

        $user->passkey_token = null;
        $user->save();

        // Hapus hanya token yang sedang dipakai saat request ini
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logout berhasil',
        ], 200);
    }

    /**
     * GET /api/me
     * Ambil data user yang sedang login (buat cek role di frontend).
     */
    public function me(Request $request)
    {
        $user = $request->user();

        return response()->json([
            'id_user'      => $user->id_user,
            'nama_lengkap' => $user->nama_lengkap,
            'username'     => $user->username,
            'role'         => $user->role,
        ]);
    }

    /**
     * Generate passkey token acak (60 karakter, sama seperti pendekatan
     * remember_token bawaan Laravel), simpan ke user, kembalikan nilainya.
     */
    private function buatPasskeyBaru(User $user): string
    {
        $passkey = Str::random(60);
        $user->passkey_token = $passkey;
        $user->save();

        return $passkey;
    }
}