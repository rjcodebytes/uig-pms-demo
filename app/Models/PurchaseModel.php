<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseModel extends Model
{
    /**
    * The attributes that should be mutated to dates.
    *
    * @var array
    */

    protected $table = 'purchases';
    protected $primaryKey = 'purchase_id';
    public $incrementing = false;
    protected $fillable = [
        'purchase_id',
        'document_id',
        'start_date',
        'end_date',
        'document',
    ];
    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime'
    ];

    public function documentID()
    {
        return $this->belongsTo(ProcModel::class, 'document_id', 'doc_id');
    }
}
