package com.evidencechain.servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

/**
 * Raw HttpServlet handling Admin Portal login display.
 * Registered via ServletRegistrationBean.
 */
public class AdminLoginServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        String error = request.getParameter("error");
        String logout = request.getParameter("logout");

        if (error != null) {
            request.setAttribute("errorMessage", "Invalid administrative credentials or account locked.");
        }
        if (logout != null) {
            request.setAttribute("logoutMessage", "You have been logged out of the administrative terminal.");
        }

        request.getRequestDispatcher("/WEB-INF/jsp/admin-login.jsp").forward(request, response);
    }
}
