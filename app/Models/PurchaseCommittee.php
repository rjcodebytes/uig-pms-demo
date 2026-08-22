<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PurchaseCommittee extends Model
{
    use HasFactory;
    protected $table = 'purchase_committee';
    protected $primaryKey = 'id';
    public $incrementing = true;
    protected $fillable = ['purchase_id', 'user_id'];
}
