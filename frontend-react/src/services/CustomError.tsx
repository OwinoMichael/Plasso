class CustomError extends Error {
  code?: string;
  data?: any;

  constructor(message: string, code?: string, data?: any) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.data = data;
    
    // Browser-compatible stack trace
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}

export default CustomError;