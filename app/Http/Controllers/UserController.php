<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    // GET /api/users
    public function index()
    {
        $users = User::select('id_user', 'nama_lengkap', 'username', 'no_telp', 'role', 'status_aktif')
            ->orderBy('id_user', 'desc')
            ->paginate(10); // pakai limit/pagination biar query efisien

        return response()->json($users);
    }

    // POST /api/users
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nama_lengkap' => 'required|string|max:50',
            'username'     => 'required|string|max:50|unique:tb_user,username',
            'no_telp'      => 'nullable|string|max:20|unique:tb_user,no_telp',
            'password'     => 'required|string|min:6',
            'role'         => 'required|in:admin,petugas,owner',
            'status_aktif' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'nama_lengkap' => $request->nama_lengkap,
            'username'     => $request->username,
            'no_telp'      => $request->no_telp,
            'password'     => $request->password, // otomatis ke-hash (cast 'hashed')
            'role'         => $request->role,
            'status_aktif' => $request->status_aktif ?? true,
        ]);

        return response()->json([
            'message' => 'User berhasil ditambahkan',
            'data'    => $user,
        ], 201);
    }

    // GET /api/users/{id}
    public function show($id)
    {
        $user = User::select('id_user', 'nama_lengkap', 'username', 'no_telp', 'role', 'status_aktif')
            ->find($id);

        if (! $user) {
            return response()->json(['message' => 'User tidak ditemukan'], 404);
        }

        return response()->json($user);
    }

    // PUT/PATCH /api/users/{id}
    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (! $user) {
            return response()->json(['message' => 'User tidak ditemukan'], 404);
        }

        $validator = Validator::make($request->all(), [
            'nama_lengkap' => 'sometimes|required|string|max:50',
            'username'     => 'sometimes|required|string|max:50|unique:tb_user,username,' . $id . ',id_user',
            'no_telp'      => 'nullable|string|max:20|unique:tb_user,no_telp,' . $id . ',id_user',
            'password'     => 'nullable|string|min:6',
            'role'         => 'sometimes|required|in:admin,petugas,owner',
            'status_aktif' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->only(['nama_lengkap', 'username', 'no_telp', 'role', 'status_aktif']);

        // Password hanya diupdate kalau diisi (opsional saat edit)
        if ($request->filled('password')) {
            $data['password'] = $request->password;
        }

        $user->update($data);

        return response()->json([
            'message' => 'User berhasil diperbarui',
            'data'    => $user,
        ]);
    }

    // DELETE /api/users/{id}
    public function destroy($id)
    {
        $user = User::find($id);

        if (! $user) {
            return response()->json(['message' => 'User tidak ditemukan'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'User berhasil dihapus']);
    }
}