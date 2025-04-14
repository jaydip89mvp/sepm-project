package com.example.inventory_management.service;

import com.example.inventory_management.model.Customer;
import com.example.inventory_management.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.time.LocalDateTime;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    // Get all customers
    public List<Customer> getAllCustomers() {
        return customerRepository.findAll();
    }

    // Get customer by ID
    public Optional<Customer> getCustomerById(String id) {
        return customerRepository.findById(id);
    }

    // Save new customer
    public Customer saveCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    // Update customer
    public Customer updateCustomer(Customer customer) {
        Optional<Customer> existingCustomer = customerRepository.findById(customer.getCustomerId());
        if (existingCustomer.isPresent()) {
            Customer updatedCustomer = existingCustomer.get();
            updatedCustomer.setName(customer.getName());
            updatedCustomer.setEmail(customer.getEmail());
            updatedCustomer.setContact(customer.getContact());
            updatedCustomer.setAddress(customer.getAddress());
            return customerRepository.save(updatedCustomer);
        }
        return null; // Or throw an exception if not found
    }

    // Delete customer by ID
    public void deleteCustomer(String id) {
        Optional<Customer> existingCustomer = customerRepository.findById(id);
        if (existingCustomer.isPresent()) {
            Customer updatedCustomer = existingCustomer.get();
            
            updatedCustomer.setActive(false);
            customerRepository.save(updatedCustomer);
        }
    }

    public Customer addNewCustomer(Customer customer) {
        customer.setAdded(LocalDateTime.now());
        return customerRepository.save(customer);
    }

    public Optional<Customer> getCustomerByName(String name) {
        return customerRepository.findByName(name);
    }

    public Object findCustomersByActive() {
        return customerRepository.findAllByActive(true);
    }

}
