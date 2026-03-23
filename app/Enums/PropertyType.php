<?php

namespace App\Enums;

enum PropertyType: string
{
    case APARTMENT = 'apartment';
    case HOUSE = 'house';
    case VILLA = 'villa';
    case CABIN = 'cabin';
    case ROOM = 'room';
    case OTHER = 'other';
}
