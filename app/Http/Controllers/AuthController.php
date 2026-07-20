<?php

namespace App\Http\Controllers;

use App\Models\LogAktivitas;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    /**
     * POST /api/login
     * Login pakai username & password (bukan email).
     * Semua role (admin, petugas, owner) lewat endpoint yang sama.
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
            'token' => $token,
        ], 200);
    }

    /**
     * POST /api/logout
     * Menghapus token yang sedang dipakai (harus sudah login/auth:sanctum).
     */
    public function logout(Request $request)
    {
        $user = $request->user();

        LogAktivitas::catat($user->id_user, 'Logout dari sistem');

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
}
