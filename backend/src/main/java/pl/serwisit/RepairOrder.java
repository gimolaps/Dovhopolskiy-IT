
package pl.serwisit;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "repair_orders")
public class RepairOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id", nullable = false)
    private Customer customer;

    @Column(name = "device_type")
    private String deviceType;

    @Column(name = "device_model")
    private String deviceModel;

    @Column(name = "problem_description")
    private String problemDescription;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private RepairStatus status;

    @Column(name = "estimated_price")
    private BigDecimal estimatedPrice;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }

    public RepairOrder() {
    }

    public Long getId() { return id; }
    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }
    public String getDeviceType() { return deviceType; }
    public String getDeviceModel() { return deviceModel; }
    public String getProblemDescription() { return problemDescription; }
    public RepairStatus getStatus() {
        return status;
    }

    public void setStatus(RepairStatus status) {
        this.status = status;
    }
    public BigDecimal getEstimatedPrice() { return estimatedPrice; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(Long id) {
        this.id = id;
    }

    public void setDeviceType(String deviceType) {
        this.deviceType = deviceType;
    }

    public void setDeviceModel(String deviceModel) {
        this.deviceModel = deviceModel;
    }

    public void setProblemDescription(String problemDescription) {
        this.problemDescription = problemDescription;
    }

    public void setEstimatedPrice(BigDecimal estimatedPrice) {
        this.estimatedPrice = estimatedPrice;
    }

}
