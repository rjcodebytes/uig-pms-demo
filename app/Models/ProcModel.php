<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;


class ProcModel extends Model
{
    use HasFactory;

    // Define the table associated with the model
    protected $table = 'documents';

    // Specify the primary key for the table
    protected $primaryKey = 'doc_id';

    // Disable the incrementing of the primary key if it's not auto-incremented
    public $incrementing = true;

    // Define the attributes that are mass assignable
    protected $fillable = [
        'doc_title',
        'doc_desc',
        'purchase_type',
        'initiator_id',
        'documents',
        'status',
    ];

    // Define the relationship with the User (initiator)
    public function initiator()
    {
        return $this->belongsTo(User::class, 'initiator_id');
    }

    // public function purchaseType()
    // {
    //     return $this->belongsTo(PurchaseType::class, 'purchase_type');
    // }

    public function purchaseType()
    {
        return $this->belongsTo(PurchaseType::class, 'purchase_type', 'id');
    }

    public function workflow()
    {
        return $this->hasMany(WorkflowModel::class, 'document_id');
    }

    public function latestWorkflow()
    {
        return $this->hasOne(WorkflowModel::class, 'document_id')->latest('id');
    }
    protected $dates = ['created_at', 'updated_at'];

    public function getDocumentsAsBase64Attribute()
    {
        return base64_encode($this->documents);
    }

    static public function getSingle($id)
    {
        return ProcModel::find($id);
    }

    static public function getRecords()
    {
        return ProcModel::select(
            'documents.*',
            'users.name as initiator_name',
            'departments.name as department_name')
        ->join('users', 'documents.initiator_id', '=', 'users.id')
        ->join('departments', 'users.department', '=', 'departments.id')
        ->orderByRaw("CASE
            WHEN documents.status = 'pending' THEN 1
            ELSE 2
        END")
        ->orderBy('documents.created_at', 'asc')
        ->get();
    }


}
