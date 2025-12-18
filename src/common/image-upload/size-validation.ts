import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  transform(value: Express.Multer.File[], metadata: ArgumentMetadata) {
    // console.log(value);
    if (!value) {
      return value;
    }
    const kbSize = 1000 * 500; // 500kb
    const isValid = value.every((file) => file.size < kbSize);
    if (!isValid) {
      throw new ForbiddenException('File size must be less than 500kb');
    }
    return value;
  }
}
