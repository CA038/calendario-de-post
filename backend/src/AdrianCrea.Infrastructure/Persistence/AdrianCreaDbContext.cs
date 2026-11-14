using AdrianCrea.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AdrianCrea.Infrastructure.Persistence;

public class AdrianCreaDbContext : DbContext
{
    public AdrianCreaDbContext(DbContextOptions<AdrianCreaDbContext> options) : base(options)
    {
    }

    public DbSet<Client> Clients => Set<Client>();
    public DbSet<Contract> Contracts => Set<Contract>();
    public DbSet<Payment> Payments => Set<Payment>();
    public DbSet<CalendarPost> CalendarPosts => Set<CalendarPost>();
    public DbSet<CustomPlan> CustomPlans => Set<CustomPlan>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Mapeo completo de la tabla 'clients' en SQL
        modelBuilder.Entity<Client>(entity =>
        {
            entity.ToTable("clients");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.Name).HasColumnName("name").IsRequired();
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.ContactEmail).HasColumnName("contact_email");
            entity.Property(e => e.ContactPhone).HasColumnName("contact_phone");
            entity.Property(e => e.SecondaryPhone).HasColumnName("secondary_phone");
            entity.Property(e => e.WebsiteUrl).HasColumnName("website_url");
            entity.Property(e => e.Notes).HasColumnName("notes");
            entity.Property(e => e.ClientType).HasColumnName("client_type");
            entity.Property(e => e.IsActive).HasColumnName("is_active");
            entity.Property(e => e.BrandColor).HasColumnName("brand_color");
            entity.Property(e => e.LogoText).HasColumnName("logo_text");
            entity.Property(e => e.LogoUrl).HasColumnName("logo_url");
            entity.Property(e => e.AccessToken).HasColumnName("access_token");
            entity.Property(e => e.TargetPostsCount).HasColumnName("target_posts_count");
            entity.Property(e => e.TargetReelsCount).HasColumnName("target_reels_count");
            entity.Property(e => e.StoriesCount).HasColumnName("stories_count");
            entity.Property(e => e.MonthlyPrice).HasColumnName("monthly_price");
            entity.Property(e => e.BillingDay).HasColumnName("billing_day");
            entity.Property(e => e.Currency).HasColumnName("currency");
            entity.Property(e => e.PlanName).HasColumnName("plan_name");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");
        });

        // Mapeo de la tabla 'contracts' en SQL
        modelBuilder.Entity<Contract>(entity =>
        {
            entity.ToTable("contracts");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ClientId).HasColumnName("client_id");
            entity.Property(e => e.ClientName).HasColumnName("client_name").IsRequired();
            entity.Property(e => e.BrandName).HasColumnName("brand_name");
            entity.Property(e => e.PlanName).HasColumnName("plan_name");
            entity.Property(e => e.PostsCount).HasColumnName("posts_count");
            entity.Property(e => e.ReelsCount).HasColumnName("reels_count");
            entity.Property(e => e.StoriesCount).HasColumnName("stories_count");
            entity.Property(e => e.Currency).HasColumnName("currency");
            entity.Property(e => e.Price).HasColumnName("price");
            entity.Property(e => e.StartDate).HasColumnName("start_date");
            entity.Property(e => e.Duration).HasColumnName("duration");
            entity.Property(e => e.FirstMonthTerms).HasColumnName("first_month_terms");
            entity.Property(e => e.RecurringDay).HasColumnName("recurring_day");
            entity.Property(e => e.Revisions).HasColumnName("revisions");
            entity.Property(e => e.CustomNotes).HasColumnName("custom_notes");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasOne(e => e.Client)
                  .WithMany(c => c.Contracts)
                  .HasForeignKey(e => e.ClientId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        // Mapeo de la tabla 'payments' en SQL
        modelBuilder.Entity<Payment>(entity =>
        {
            entity.ToTable("payments");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ReceiptFolio).HasColumnName("receipt_folio");
            entity.Property(e => e.ClientId).HasColumnName("client_id");
            entity.Property(e => e.ClientName).HasColumnName("client_name");
            entity.Property(e => e.BrandName).HasColumnName("brand_name");
            entity.Property(e => e.Month).HasColumnName("month");
            entity.Property(e => e.Year).HasColumnName("year");
            entity.Property(e => e.PaidDate).HasColumnName("paid_date");
            entity.Property(e => e.Currency).HasColumnName("currency");
            entity.Property(e => e.Amount).HasColumnName("amount");
            entity.Property(e => e.Method).HasColumnName("method");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.Reference).HasColumnName("reference");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasOne(e => e.Client)
                  .WithMany(c => c.Payments)
                  .HasForeignKey(e => e.ClientId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        // Mapeo de la tabla 'calendar_posts' en SQL
        modelBuilder.Entity<CalendarPost>(entity =>
        {
            entity.ToTable("calendar_posts");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.ClientId).HasColumnName("client_id");
            entity.Property(e => e.ClientName).HasColumnName("client_name").IsRequired();
            entity.Property(e => e.BrandColor).HasColumnName("brand_color");
            entity.Property(e => e.Title).HasColumnName("title").IsRequired();
            entity.Property(e => e.PostType).HasColumnName("post_type");
            entity.Property(e => e.Status).HasColumnName("status");
            entity.Property(e => e.ScheduledDate).HasColumnName("scheduled_date");
            entity.Property(e => e.Notes).HasColumnName("notes");
            entity.Property(e => e.CreatedAt).HasColumnName("created_at");
            entity.Property(e => e.UpdatedAt).HasColumnName("updated_at");

            entity.HasOne(e => e.Client)
                  .WithMany()
                  .HasForeignKey(e => e.ClientId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        // Mapeo de la tabla 'custom_plans' en SQL
        modelBuilder.Entity<CustomPlan>(entity =>
        {
            entity.ToTable("custom_plans");
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.PlanId).HasColumnName("plan_id");
            entity.Property(e => e.Name).HasColumnName("name");
            entity.Property(e => e.Price).HasColumnName("price");
            entity.Property(e => e.Posts).HasColumnName("posts");
            entity.Property(e => e.Reels).HasColumnName("reels");
            entity.Property(e => e.Stories).HasColumnName("stories");
            entity.Property(e => e.Currency).HasColumnName("currency");
            entity.Property(e => e.Badge).HasColumnName("badge");
            entity.Property(e => e.FeaturesJson).HasColumnName("features");
        });
    }
}
