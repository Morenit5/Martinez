import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { AlreadyHasActiveConnectionError, DataTypeNotSupportedError, InsertValuesMissingError, MissingPrimaryColumnError, QueryFailedError, UpdateValuesMissingError } from "typeorm";

@Injectable()
export class TypeORMExceptions {
    httpStatus: HttpStatus;
    errMsg: string;
    cause: any;

    constructor() {
    }

    sendException(error: unknown) {

        if (error instanceof AlreadyHasActiveConnectionError) {
            this.httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
            this.errMsg = "Connection already available";
            this.cause = error;

        } else if (error instanceof DataTypeNotSupportedError) {
            this.httpStatus = HttpStatus.BAD_REQUEST;
            this.errMsg = "Unsupported datatype";
            this.cause = error;

        } else if (error instanceof InsertValuesMissingError) {
            this.httpStatus = HttpStatus.BAD_REQUEST;
            this.errMsg = "Insert values are missing in the request";
            this.cause = error;

        } else if (error instanceof MissingPrimaryColumnError) {
            this.httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
            this.errMsg = "Primary column error";
            this.cause = error;

        } else if (error instanceof UpdateValuesMissingError) {
            this.httpStatus = HttpStatus.BAD_REQUEST;
            this.errMsg = "Update values are missing in the request";
            this.cause = error;

        } else if (error instanceof QueryFailedError) { // Handle specific database query errors
            this.httpStatus = HttpStatus.BAD_REQUEST;
            this.errMsg = "Query failed with error "+ error;
            this.cause = error;
            //console.error('TypeORM QueryFailedError:', error.message); // find out what is the error QueryFailedErrors
        
        } else if (error instanceof Error) {
            this.httpStatus = HttpStatus.INTERNAL_SERVER_ERROR
            this.errMsg = 'Error: '+ error.message;
            this.cause = error;
            
        } else {
            // Handle cases where the thrown value is not an Error object
            this.httpStatus = HttpStatus.INTERNAL_SERVER_ERROR
            this.errMsg = 'An unknown error occurred: ' + error;
            this.cause = error;
        }

        this.throwException(this.httpStatus,this.errMsg,this.cause);
    }

    private throwException(httpStatus: HttpStatus, errMsg: string, cause: any) {
        throw new HttpException({
            status: httpStatus,
            error: errMsg
        },
            httpStatus, {
            cause: cause
        });
    }

}