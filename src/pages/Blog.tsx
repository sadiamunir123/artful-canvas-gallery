import { useState } from "react";
import { ArrowLeft, Calendar, Tag, Clock } from "lucide-react";
import { blogPosts } from "@/data/blogPosts";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

const readingTime = (text: string) => Math.max(1, Math.round(text.split(/\s+/).length / 220));

const Blog = () => {
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const post = blogPosts.find((p) => p.id === selectedPost);

  return (
    <div className="min-h-screen bg-page">
      <Navbar />
      <div className="pt-24 md:pt-28 pb-16 px-4 sm:px-6 md:px-12">
        <div className="container mx-auto">
          {post ? (
            <article className="max-w-3xl mx-auto">
              <button
                onClick={() => setSelectedPost(null)}
                className="inline-flex items-center gap-2 font-body text-xs tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors mb-8"
              >
                <ArrowLeft size={14} /> Back to Articles
              </button>

              <div className="mb-8">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-5">
                  <span className="inline-flex items-center gap-1.5 font-body text-[10px] tracking-[0.25em] uppercase text-primary">
                    <Tag size={11} /> {post.category}
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-body text-[11px] text-muted-foreground">
                    <Calendar size={11} /> {formatDate(post.date)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-body text-[11px] text-muted-foreground">
                    <Clock size={11} /> {readingTime(post.content)} min read
                  </span>
                </div>
                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl text-foreground leading-[1.1] tracking-tight mb-6">
                  {post.title}
                </h1>
                <div className="brand-line w-16 mb-6" />
                <p className="font-elegant text-lg sm:text-xl text-foreground/70 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <figure className="mb-12 -mx-4 sm:mx-0">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full aspect-[16/9] object-cover"
                />
              </figure>

              <div className="prose prose-invert max-w-none">
                {post.content.split("\n\n").map((paragraph, i) => (
                  <p
                    key={i}
                    className={`font-elegant text-lg sm:text-xl text-foreground/85 leading-[1.8] mb-7 ${
                      i === 0 ? "first-letter:font-display first-letter:text-5xl first-letter:float-left first-letter:mr-3 first-letter:leading-none first-letter:text-primary" : ""
                    }`}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-16 pt-8 border-t border-border/40">
                <button
                  onClick={() => setSelectedPost(null)}
                  className="inline-flex items-center gap-2 font-body text-xs tracking-widest uppercase text-primary hover:text-primary/80 transition-colors"
                >
                  <ArrowLeft size={14} /> All Articles
                </button>
              </div>
            </article>
          ) : (
            <>
              <div className="mb-12">
                <p className="font-body text-xs tracking-[0.3em] uppercase text-primary mb-2">Stories & Thesis</p>
                <h1 className="font-display text-4xl md:text-5xl text-foreground">Journal</h1>
                <div className="brand-line w-16 mt-4" />
                <p className="font-elegant text-base md:text-lg text-foreground/60 mt-4 max-w-xl">
                  Conceptual stories, thesis explorations, and the creative process behind each painting.
                </p>
              </div>

              {/* Featured post */}
              {blogPosts[0] && (
                <article
                  className="mb-16 cursor-pointer group"
                  onClick={() => setSelectedPost(blogPosts[0].id)}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                    <div className="overflow-hidden">
                      <img
                        src={blogPosts[0].image}
                        alt={blogPosts[0].title}
                        className="w-full aspect-[4/3] object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div>
                      <span className="inline-flex items-center gap-1.5 font-body text-[10px] tracking-[0.25em] uppercase text-primary mb-3">
                        Featured · {blogPosts[0].category}
                      </span>
                      <h2 className="font-display text-2xl md:text-3xl lg:text-4xl text-foreground mb-4 leading-tight group-hover:text-primary transition-colors">
                        {blogPosts[0].title}
                      </h2>
                      <p className="font-elegant text-base md:text-lg text-foreground/65 leading-relaxed mb-5">
                        {blogPosts[0].excerpt}
                      </p>
                      <div className="flex items-center gap-4 font-body text-xs text-muted-foreground">
                        <span className="inline-flex items-center gap-1.5"><Calendar size={11} /> {formatDate(blogPosts[0].date)}</span>
                        <span className="inline-flex items-center gap-1.5"><Clock size={11} /> {readingTime(blogPosts[0].content)} min read</span>
                      </div>
                    </div>
                  </div>
                </article>
              )}

              {/* Other posts grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.slice(1).map((p) => (
                  <article
                    key={p.id}
                    className="cursor-pointer group flex flex-col"
                    onClick={() => setSelectedPost(p.id)}
                  >
                    <div className="overflow-hidden mb-4 aspect-[4/3]">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                    <span className="font-body text-[10px] tracking-[0.25em] uppercase text-primary">{p.category}</span>
                    <h3 className="font-display text-xl text-foreground mt-2 mb-2 group-hover:text-primary transition-colors leading-snug">
                      {p.title}
                    </h3>
                    <p className="font-elegant text-base text-foreground/60 mb-3 leading-relaxed line-clamp-3">{p.excerpt}</p>
                    <div className="mt-auto flex items-center gap-3 font-body text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1"><Calendar size={11} /> {formatDate(p.date)}</span>
                      <span>·</span>
                      <span className="inline-flex items-center gap-1"><Clock size={11} /> {readingTime(p.content)} min</span>
                    </div>
                  </article>
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
