<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Deuda extends Model
{
    use HasFactory;
    protected $fillable = [
        'usuario_id',
        'monto_inicial',
        'interes',
        'total_deuda',
        'fecha_inicio'
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }

    public function pagos()
    {
        return $this->hasMany(Pago::class);
    }
    
}
