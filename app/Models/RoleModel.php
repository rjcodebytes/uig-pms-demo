<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RoleModel extends Model
{
    protected $table = "roles";

    static public function getRecords()
    {
        return RoleModel::get();
    }

    static public function getSingle($id)
    {
        return RoleModel::find($id);
    }
}
