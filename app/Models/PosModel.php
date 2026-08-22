<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PosModel extends Model
{
    protected $table = "positions";

    protected $primaryKey = "name";

    public $incrementing = false;

    protected $keyType = 'string';

    static public function getRecords()
    {
        return PosModel::get();
    }

    static public function getSingle($id)
    {
        return PosModel::find($id);
    }
}
