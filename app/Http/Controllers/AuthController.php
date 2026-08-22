<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login()
    {
        //dd(Hash::make('admin'));

        if(!empty(Auth::check()))
        {
            // Redirect based on role
            switch (Auth::user()->role) {
                case 1:
                    return redirect('admin/dashboard');
                case 2:
                    return redirect('approver/dashboard');
                case 3:
                    return redirect('initiator/dashboard');
                case 4:
                    return redirect('storeincharge/dashboard');
                case 5:
                    return redirect('storekeeper/dashboard');
                default:
                    // Logout user if role is not valid
                    Auth::logout();
                    return redirect()->back()->with('error', 'Invalid user role. Please contact the administrator.');
            }
        }

        return view('auth.login');
    }

    public function auth_login(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'password' => 'required|string',
        ]);

        //dd($request->all());
        $remember = !empty($request->remember) ? true : false;

        if (Auth::attempt(['username' => $request->username, 'password' => $request->password], $remember))
        {

            $user = Auth::user();

            // Redirect based on role
            switch ($user->role) {
                case 1:
                    return redirect('admin/dashboard');
                case 2:
                    return redirect('approver/dashboard');
                case 3:
                    return redirect('initiator/dashboard');
                case 4:
                    return redirect('storeincharge/dashboard');
                case 5:
                    return redirect('storekeeper/dashboard');
                default:
                    // Logout user if role is not valid
                    Auth::logout();
                    return redirect()->back()->with('error', 'Invalid user role. Please contact the administrator.');
            }
        }
        return redirect()->back()->with('error', 'Invalid username or password.');
    }

    public function logout(){
        // Log the user out
        Auth::logout();

        // Invalidate the session
        session()->invalidate();

        // Regenerate the CSRF token
        session()->regenerateToken();

        // Redirect to login with a flash message (optional)
        return redirect(url(''))->with('success', 'You have been logged out successfully.');
    }
}
