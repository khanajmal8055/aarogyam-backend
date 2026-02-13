class ApiError extends Error{
    public statusCode:number;
    public success:boolean = false;
    public error:unknown[];

    constructor(statusCode:number,message:string = 'Something Went Wrong',error:unknown[]=[]){
       super(message)
       this.statusCode = statusCode,
       this.error = error

       Error.captureStackTrace(this , this.constructor)
    }


}

export {ApiError}