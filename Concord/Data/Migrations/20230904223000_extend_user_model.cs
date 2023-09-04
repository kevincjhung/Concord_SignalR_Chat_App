using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Concord.Migrations
{
    /// <inheritdoc />
    public partial class extendusermodel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ProfilePicURL",
                table: "Users",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProfilePicURL",
                table: "Users");
        }
    }
}
