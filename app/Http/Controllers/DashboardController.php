<?php

namespace App\Http\Controllers;

use App\Models\PosModel;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\RoleModel;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function dashboard()
    {
        return view('admin.dashboard');
    }

    public function profile()
    {
        $roleName = RoleModel::find(Auth::user()->id);
        return view ('admin.profile', compact('roleName'));
    }

    public function approverProfile()
    {
        $roleName = RoleModel::find(Auth::user()->role);
        $deptName = PosModel::find(Auth::user()->position);
        return view ('approver.profile', compact('roleName', 'deptName'));
    }
    public function initiatorProfile()
    {
        $roleName = RoleModel::find(Auth::user()->role);
        return view ('initiator.profile', compact('roleName'));
    }
    public function storeinchargeProfile()
    {
        $roleName = RoleModel::find(Auth::user()->role);
        return view ('storeincharge.profile', compact('roleName'));
    }
    public function storekeeperProfile()
    {
        $roleName = RoleModel::find(Auth::user()->role);
        return view ('storekeeper.profile', compact('roleName'));
    }


}
