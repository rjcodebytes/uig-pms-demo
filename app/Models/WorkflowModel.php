<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Auth;

class WorkflowModel extends Model
{
    use HasFactory;

    // Define the table associated with the model
    protected $table = 'workflow';

    // Specify the primary key for the table
    protected $primaryKey = 'id';

    // Disable the incrementing of the primary key if it's not auto-incremented
    public $incrementing = true;

    // Define the attributes that are mass assignable
    protected $fillable = [
        'document_id',
        'reviewer_id',
        'status',
        'remark',
    ];

    public $timestamps = false;

    public function document()
    {
        return $this->belongsTo(ProcModel::class, 'document_id');
    }

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    static public function getWorkflow($filters = [])
    {
        $query = self::where('reviewer_id', Auth::id())
            ->with('document.initiator.dept') // Eager load related document details
            ->orderBy('updated_at', 'desc');

        // Apply department filter if provided
        if (!empty($filters['department'])) {
            $query->whereHas('document.initiator.dept', function ($q) use ($filters) {
                $q->where('name', $filters['department']);
            });
        }

        return $query->get();
    }

}
