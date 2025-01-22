export default function Blog() {
    const featuredPost = {
      title: "Porque nikken me cambio la vida",
      description: "Descubre como nikken me cambio la vida",
      image: "/placeholder-featured.jpg", // Replace with blob image URL later
      link: "#",
    };
  
    const recentPosts = [
      { id: 1, date: "January 10, 2025", title: "Ejemplo 4", link: "#" },
      { id: 2, date: "January 10, 2025", title: "Ejemplo 3", link: "#" },
      { id: 3, date: "January 9, 2025", title: "Ejemplo 2", link: "#" },
      { id: 4, date: "January 4, 2025", title: "Ejemplo 1", link: "#" },
    ];
  
    return (
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Featured Post */}
          <div className="lg:col-span-2">
            <a href={featuredPost.link} className="block group">
              <img
                src={featuredPost.image}
                alt={featuredPost.title}
                className="w-full h-64 object-cover rounded-lg mb-4 group-hover:opacity-90 transition"
              />
              <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition">
                {featuredPost.title}
              </h2>
              <p className="text-gray-700">{featuredPost.description}</p>
            </a>
          </div>
  
          {/* Recent Posts */}
          <div>
            <h3 className="text-xl font-bold mb-4">Nuevos posts</h3>
            <ul className="space-y-4">
              {recentPosts.map((post) => (
                <li key={post.id}>
                  <a href={post.link} className="block group">
                    <p className="text-sm text-gray-500 mb-1">{post.date}</p>
                    <h4 className="text-lg font-medium group-hover:text-primary transition">
                      {post.title}
                    </h4>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
  