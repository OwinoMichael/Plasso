export class CustomError extends Error {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public data: any;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(message: string, name: string, data: any) {
    super(message);
    this.name = name;
    this.data = data;
    
    // Ensure the prototype chain is correct
    Object.setPrototypeOf(this, CustomError.prototype);
    
    // Capture stack trace if available
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
  }
  
  // Add a method to help with debugging
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      data: this.data,
      stack: this.stack
    };
  }
}

