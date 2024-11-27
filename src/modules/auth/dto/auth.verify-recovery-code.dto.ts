import { ApiProperty } from "@nestjs/swagger";
import {
    IsNotEmpty,
    IsString,
    Length
} from "class-validator";


export class VerifyRecoveryCodeDto {
    @ApiProperty({
        description: 'El código de 4 dígitos enviado al correo del usuario.',
        example: '1234'
    })
    @IsNotEmpty({
        message: 'El código de recuperación es obligatorio.'
    })
    @IsString()
    @Length(4, 4, { message: 'El código debe tener exactamente 4 dígitos.' })
    recoveryCode: string
}