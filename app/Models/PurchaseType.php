<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class PurchaseType extends Model
{

    protected $table = 'purchase_types';
    protected $primaryKey = 'id';
    public $incrementing = true;

    protected $fillable = ['name', 'description', 'estimated_cost'];


    static public function getRecords()
    {
        return PurchaseType::get();
    }

    static public function getSingle($id)
    {
        return PurchaseType::find($id);
    }

    public function documents()
    {
        return $this->hasMany(ProcModel::class, 'purchase_type', 'id');
    }
}
