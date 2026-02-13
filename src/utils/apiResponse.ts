class ApiResponse<T>{
    constructor(
        public statusCode:number , 
        public data:T , 
        public message:string = "SUCCESS",
        public success:boolean = true
    ){}
}

export {ApiResponse}