<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DeptModel extends Model
{
    protected $table = "departments";
    protected $primaryKey = "name";
    public $incrementing = false;

    protected $keyType = 'string';

    public function users()
    {
        return $this->belongsTo(User::class, 'name');
    }

    static public function getRecords()
    {
        return DeptModel::get();
    }

    static public function getSingle($name)
    {
        return DeptModel::find($name);
    }
}
