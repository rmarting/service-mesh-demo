package com.redhat.cloudnative.gateway;

/**
 * HttpRuntimeException
 */
public class HttpRuntimeException extends RuntimeException {
    private Integer status = 0;

    public HttpRuntimeException(String message, Integer status) {
        super(message);
        this.status = status;
    }

    /**
     * @return the status
     */
    public Integer getStatus() {
        return status;
    }
}