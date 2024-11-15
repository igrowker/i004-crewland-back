import { ObjectId } from 'typeorm';

export class CreateFestivalDto {
  _id: ObjectId;
  name: string;
  location: string;
  date: Date;
  description: string;
}

// import { IsString, IsNotEmpty, IsDateString, MaxLength } from 'class-validator';
// import { ApiProperty } from '@nestjs/swagger';
// import { ObjectId } from 'typeorm';

// export class CreateFestivalDto {
//   @ApiProperty({
//     description: 'El ID del festival (opcional)',
//     example: '60c72b2f9b1e8e001c8e4b3c',
//     required: false,
//   })
//   _id?: ObjectId; // Hacemos el ID opcional

//   @ApiProperty({
//     description: 'El nombre del festival',
//     example: 'Festival de Música',
//   })
//   @IsString()
//   @IsNotEmpty({ message: 'El nombre del festival es obligatorio' })
//   @MaxLength(100, { message: 'El nombre no puede exceder los 100 caracteres.' })
//   name: string;

//   @ApiProperty({
//     description: 'La ubicación del festival',
//     example: 'Parque Central, Ciudad',
//   })
//   @IsString()
//   @IsNotEmpty({ message: 'La ubicación es obligatoria' })
//   location: string;

//   @ApiProperty({
//     description: 'La fecha del festival en formato ISO',
//     example: '2024-11-15T00:00:00Z',
//   })
//   @IsDateString({}, { message: 'La fecha debe ser una cadena en formato ISO' })
//   date: Date;

//   @ApiProperty({
//     description: 'Una descripción breve del festival',
//     example:
//       'Un festival anual de música con artistas locales e internacionales.',
//     required: false,
//   })
//   @IsString()
//   @MaxLength(500, {
//     message: 'La descripción no puede exceder los 500 caracteres.',
//   })
//   description?: string; // Hacemos la descripción opcional
// }
