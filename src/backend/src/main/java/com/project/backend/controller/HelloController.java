package com.project.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.backend.algorithms.UCS.Test;


@RestController
public class HelloController {

    @GetMapping("/api/test")
    public String hello() {
        Test.run();
        return "Hello Wsorld";
    }
}