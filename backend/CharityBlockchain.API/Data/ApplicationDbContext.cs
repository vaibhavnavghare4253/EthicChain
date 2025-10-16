using Microsoft.EntityFrameworkCore;

namespace CharityBlockchain.API.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // Note: We're using stored procedures, so we don't define DbSets for entities
    // This context is primarily for executing raw SQL and stored procedures
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        
        // Configure any entity relationships if needed
    }
}

