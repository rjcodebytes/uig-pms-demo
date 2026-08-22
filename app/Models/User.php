<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'mobile',
        'gender',
        'username',
        'password',
        'role',
        'position',
        'department',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function dept()
    {
        return $this->belongsTo(DeptModel::class, 'department');
    }

    static public function getRecords()
    {
        return User::select('users.*', 'roles.name as role_name')
                ->join('roles', 'roles.id', '=', 'users.role')
                ->orderBy('users.id', 'asc')
                ->get();
    }

    static public function getSingle($id)
    {
        return User::find($id);
    }

    public function roles()
    {
        return $this->belongsTo(RoleModel::class, 'role');
    }

    static public function getUsers()
    {
        $initiators = User::where('role', 3)
                    ->with('roles')
                    ->get();
        return $initiators;
    }
}
