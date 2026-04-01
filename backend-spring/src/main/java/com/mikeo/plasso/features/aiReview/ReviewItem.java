package com.mikeo.plasso.features.aiReview;

public class ReviewItem {

    private String type;    // "warning", "suggestion", "info"
    private String title;
    private String message;
    private Integer line;   // nullable

    public ReviewItem() {}

    public ReviewItem(String type, String title, String message, Integer line) {
        this.type = type;
        this.title = title;
        this.message = message;
        this.line = line;
    }

    public Integer getLine() {
        return line;
    }

    public void setLine(Integer line) {
        this.line = line;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }
}
