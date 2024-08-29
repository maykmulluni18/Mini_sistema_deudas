<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pago extends Model
{
    use HasFactory;
    protected $fillable = [
        'deuda_id',
        'monto_pago',
        'descuento',
        'fecha_pago',
    ];

    public function deuda()
    {
        return $this->belongsTo(Deuda::class);
    }
}
