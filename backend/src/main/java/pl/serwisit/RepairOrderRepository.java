package pl.serwisit;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RepairOrderRepository
        extends JpaRepository<RepairOrder, Long> {

    List<RepairOrder> findByCustomer_Id(Long customerId);

    List<RepairOrder> findByStatus(RepairStatus status);
}