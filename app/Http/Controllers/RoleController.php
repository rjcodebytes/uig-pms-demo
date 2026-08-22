<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\RoleModel;

class RoleController extends Controller
{
    public function list()
    {
        $data['getRecords'] = RoleModel::getRecords();
        return view("admin.role.list", $data);
    }
    public function createrole()
    {
        return view("admin.role.add");
    }

    public function insert(Request $request)
    {
        $save = new RoleModel;
        $save->name = $request->rolename;
        $save->save();

        return redirect('admin/roles')->with('success','New Role Successfully Created!');
    }

    public function edit($id)
    {
        $data['getRecord'] = RoleModel::getSingle($id);
        return view("admin.role.edit", $data);
    }

    public function updaterole($id, Request $request)
    {
        $save = RoleModel::getSingle($id);
        $save->name = $request->rolename;
        $save->save();

        return redirect('admin/roles')->with('success','Role Successfully Updated!');
    }

    public function deleterole($id, Request $request)
    {
        $save = RoleModel::getSingle($id);
        $save->delete();

        return redirect('admin/roles')->with('success','Role Successfully Deleted!');
    }

}
