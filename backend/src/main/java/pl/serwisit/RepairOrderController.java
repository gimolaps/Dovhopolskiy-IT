package pl.serwisit;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import java.util.List;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;



@RestController
@RequestMapping("/api/repair-orders")
public class RepairOrderController {

    private final RepairOrderRepository repairOrderRepository;
    private final CustomerRepository customerRepository;

    public RepairOrderController(
            RepairOrderRepository repairOrderRepository,
            CustomerRepository customerRepository) {
        this.repairOrderRepository = repairOrderRepository;
        this.customerRepository = customerRepository;
    }

    @GetMapping
    public List<RepairOrder> getAllRepairOrders() {
        return repairOrderRepository.findAll();
    }


    @GetMapping("/status/{status}")
    public List<RepairOrder> getRepairOrdersByStatus(
            @PathVariable("status") RepairStatus status) {
        return repairOrderRepository.findByStatus(status);
    }


    @GetMapping("/{id}")
    public RepairOrder getRepairOrderById(@PathVariable Long id) {
        return repairOrderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Repair order not found"));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RepairOrder createRepairOrder(@RequestBody RepairOrder repairOrder) {
        if (repairOrder.getCustomer() == null
                || repairOrder.getCustomer().getId() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "customerId is required");
        }

        Long customerId = repairOrder.getCustomer().getId();

        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Customer not found"));

        repairOrder.setCustomer(customer);
        repairOrder.setId(null);

        return repairOrderRepository.save(repairOrder);
    }


    @PatchMapping("/{id}/status")
    public RepairOrder updateStatus(
            @PathVariable Long id,
            @RequestBody String status) {

        RepairOrder order = repairOrderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Repair order not found"));

        RepairStatus newStatus;
        try {
            newStatus = RepairStatus.valueOf(
                    status.trim().replace("\"", ""));
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST, "Invalid repair status");
        }

        RepairStatus currentStatus = order.getStatus();

        if (currentStatus == RepairStatus.COMPLETED
                && newStatus != RepairStatus.COMPLETED) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Completed orders cannot be reopened");
        }

        order.setStatus(newStatus);
        return repairOrderRepository.save(order);
    }


    @PutMapping("/{id}")
    public RepairOrder updateRepairOrder(
            @PathVariable Long id,
            @RequestBody RepairOrder updatedOrder) {

        RepairOrder order = repairOrderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Repair order not found"));

        order.setDeviceType(updatedOrder.getDeviceType());
        order.setDeviceModel(updatedOrder.getDeviceModel());
        order.setProblemDescription(updatedOrder.getProblemDescription());
        order.setEstimatedPrice(updatedOrder.getEstimatedPrice());

        return repairOrderRepository.save(order);
    }

    @DeleteMapping("/{id}")
    @org.springframework.web.bind.annotation.ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRepairOrder(@PathVariable Long id) {
        if (!repairOrderRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Repair order not found");
        }

        repairOrderRepository.deleteById(id);
    }
    @GetMapping("/customer/{customerId}")
    public List<RepairOrder> getRepairOrdersByCustomer(
            @PathVariable Long customerId) {
        return repairOrderRepository.findByCustomer_Id(customerId);
    }

}