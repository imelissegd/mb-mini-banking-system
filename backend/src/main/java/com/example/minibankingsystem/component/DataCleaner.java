package com.example.minibankingsystem.component;

import com.example.minibankingsystem.repository.BankAccountRepository;
import com.example.minibankingsystem.repository.TransactionRepository;
import com.example.minibankingsystem.repository.UserRepository;
import jakarta.annotation.PreDestroy;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DataCleaner {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Value("${app.seeder.clear-on-shutdown:true}")
    private boolean clearOnShutdown;

    @EventListener
    public void clear(ContextClosedEvent event) {
        if (!clearOnShutdown) return;

        jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 0");

        jdbcTemplate.queryForList(
                "SELECT table_name FROM information_schema.tables WHERE table_schema = 'minibankingsystem'",
                String.class
        ).forEach(table -> jdbcTemplate.execute("TRUNCATE TABLE minibankingsystem." + table));

        jdbcTemplate.execute("SET FOREIGN_KEY_CHECKS = 1");

        System.out.println("✅ All tables truncated on shutdown");
    }
}