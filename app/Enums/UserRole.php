<?php

namespace App\Enums;

enum UserRole: string
{
    case ADMINISTRADOR = 'administrador';
    case PROPIETARIO = 'propietario';
    case CLIENTE = 'cliente';
}
