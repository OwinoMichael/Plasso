package com.mikeo.plasso.features.judge0;

public class ExecutionResult {

    String stdout;
    String stderr;
    String status;      // "Accepted", "Runtime Error", etc.
    double time;        // execution time in seconds
    int memory;          // memory used in KB

    public ExecutionResult() {
    }

    public ExecutionResult(String stdout, String stderr, String status,   double time, int memory) {
        this.memory = memory;
        this.status = status;
        this.stderr = stderr;
        this.stdout = stdout;
        this.time = time;
    }

    public int getMemory() {
        return memory;
    }

    public String getStatus() {
        return status;
    }

    public String getStderr() {
        return stderr;
    }

    public String getStdout() {
        return stdout;
    }

    public double getTime() {
        return time;
    }
}
