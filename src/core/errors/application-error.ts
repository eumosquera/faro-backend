export interface ApplicationErrorOptions {
  code: string;
  message: string;
  statusCode: number;
}

export class ApplicationError extends Error {
  public readonly code: string;
  public readonly statusCode: number;

  constructor(options: ApplicationErrorOptions) {
    super(options.message);

    this.name = this.constructor.name;
    this.code = options.code;
    this.statusCode = options.statusCode;
  }
}
