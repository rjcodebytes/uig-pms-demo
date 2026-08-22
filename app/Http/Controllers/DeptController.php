<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\DeptModel;

class DeptController extends Controller
{
    public function list()
    {
        $data['getRecords'] = DeptModel::getRecords();
        return view("admin.department.list", $data);
    }
    public function createdept()
    {
        return view("admin.department.add");
    }

    public function insert(Request $request)
    {
        $save = new DeptModel;
        $save->name = $request->deptname;
        $save->save();

        return redirect('admin/departments')->with('success','New Department Successfully Created!');
    }

    public function edit($name)
    {
        $data['getRecord'] = DeptModel::getSingle($name);
        return view("admin.department.edit", $data);
    }

    public function updatedept($name, Request $request)
    {
        $save = DeptModel::getSingle($name);
        $save->name = $request->deptname;
        $save->save();

        return redirect('admin/departments')->with('success','Department Successfully Updated!');
    }

    public function deletedept($name, Request $request)
    {
        try{
            $save = DeptModel::getSingle($name);
            $save->delete();

            return redirect('admin/departments')->with('success','Department Successfully Deleted!');
        }
        catch (\Exception $e) {

            return redirect()->back()->with('error', 'Department cannot be deleted!');
        }
    }

}
