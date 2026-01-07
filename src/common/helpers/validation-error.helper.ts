import { ValidationError } from 'class-validator';

/**
 * Recursively extracts all validation error messages from a ValidationError tree
 * and formats them with their full property paths.
 *
 * @param errors - Array of ValidationError objects from class-validator
 * @param parentPath - The parent property path (used for recursion)
 * @returns Array of formatted error messages with full property paths
 *
 * @example
 * // For a nested DTO like CreateShiftRequestDto with errors in shift.name and route.geometry[0].lat
 * // Returns: [
 * //   "shift.name must be at least 3 characters long",
 * //   "route.geometry[0].lat must not be greater than 90"
 * // ]
 */
export function formatValidationErrors(
  errors: ValidationError[],
  parentPath: string = '',
): string[] {
  const errorMessages: string[] = [];

  for (const error of errors) {
    // Build the full property path
    const propertyPath = parentPath
      ? `${parentPath}.${error.property}`
      : error.property;

    // If this error has constraints (actual validation errors), add them
    if (error.constraints) {
      const messages = Object.values(error.constraints).map(
        (message) => `${propertyPath}: ${message}`,
      );
      errorMessages.push(...messages);
    }

    // If this error has children (nested validation errors), recurse
    if (error.children && error.children.length > 0) {
      const childErrors = formatValidationErrors(error.children, propertyPath);
      errorMessages.push(...childErrors);
    }
  }

  return errorMessages;
}

/**
 * Creates a user-friendly error message object from validation errors
 *
 * @param errors - Array of ValidationError objects from class-validator
 * @returns Object with message and errors array
 */
export function createValidationErrorResponse(errors: ValidationError[]) {
  const formattedErrors = formatValidationErrors(errors);

  return {
    message: 'Validation failed',
    errors: formattedErrors,
  };
}
