import { useState } from "react";
import { ArrowLeft, Calendar, Tag } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Blog = () => {
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const post = blogPosts.find((p) => p.id === selectedPost);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-24 pb-16 px-6 md:px-12">
        <div className="container mx-auto">
          {post ? (
            <article className="max-w-3xl mx-auto">
              <button
                onClick={() => setSelectedPost(null)}
                className="inline-flex items-center gap-2 font-body text-sm text-muted-foreground hover:text-primary transition-colors mb-8"
              >
                <ArrowLeft size={16} /> Back to Articles
              </button>
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="inline-flex items-center gap-1 font-body text-xs tracking-widest uppercase text-primary">
                    <Tag size={12} /> {post.category}
                  </span>
                  <span className="inline-flex items-center gap-1 font-body text-xs text-muted-foreground">
                    <Calendar size={12} /> {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </span>
                </div>
                <h1 className="font-display text-3xl md:text-5xl text-foreground leading-tight mb-6">{post.title}</h1>
                <div className="brand-line w-16 mb-6" />
              </div>
              <img src={post.image} alt={post.title} className="w-full aspect-video object-cover mb-10" />
              <div className="prose prose-invert max-w-none">
                {post.content.split("\n\n").map((paragraph, i) => (
                  <p key={i} className="font-elegant text-lg text-foreground/80 leading-relaxed mb-6">
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          ) : (
            <>
              <div className="mb-12">
                <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-2">Stories & Thesis</p>
                <h1 className="font-display text-4xl md:text-5xl text-foreground">Blog</h1>
                <div className="brand-line w-16 mt-4" />
                <p className="font-elegant text-lg text-foreground/60 mt-4 max-w-xl">
                  Conceptual stories, thesis explorations, and the creative process behind each painting.
                </p>
              </div>

              {/* Featured post */}
              <div
                className="mb-12 cursor-pointer group"
                onClick={() => setSelectedPost(blogPosts[0].id)}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="overflow-hidden">
                    <img
                      src={blogPosts[0].image}
                      alt={blogPosts[0].title}
                      className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="font-body text-xs tracking-widest uppercase text-primary mb-3">{blogPosts[0].category}</span>
                    <h2 className="font-display text-2xl md:text-3xl text-foreground mb-4 group-hover:text-primary transition-colors">
                      {blogPosts[0].title}
                    </h2>
                    <p className="font-elegant text-base text-foreground/60 mb-4">{blogPosts[0].excerpt}</p>
                    <span className="font-body text-xs text-muted-foreground">
                      {new Date(blogPosts[0].date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Other posts grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.slice(1).map((p) => (
                  <div
                    key={p.id}
                    className="cursor-pointer group"
                    onClick={() => setSelectedPost(p.id)}
                  >
                    <div className="overflow-hidden mb-4">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <span className="font-body text-xs tracking-widest uppercase text-primary">{p.category}</span>
                    <h3 className="font-display text-xl text-foreground mt-2 mb-2 group-hover:text-primary transition-colors">
                      {p.title}
                    </h3>
                    <p className="font-elegant text-sm text-foreground/60 mb-3">{p.excerpt}</p>
                    <span className="font-body text-xs text-muted-foreground">
                      {new Date(p.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Blog;
