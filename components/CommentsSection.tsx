import React, { useState, useEffect } from 'react';
import { MessageCircle, Heart, Reply, Send, Trash2 } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { useNotification } from '../context/NotificationContext';
import { Comment } from '../types';

const timeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'hace un momento';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `hace ${hours} h`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `hace ${days} días`;
    return date.toLocaleDateString();
};

// Recursive Component
interface CommentItemProps {
    comment: Comment;
    level?: number;
    onReply: (id: string) => void;
    onLike: (id: string) => void;
    replyingTo: string | null;
    submitReply: (parentId: string, content: string) => Promise<void>;
    loading: boolean;
    onDelete: (id: string, parentId: string | null) => Promise<void>;
    currentUserId?: string;
}

const CommentItem: React.FC<CommentItemProps> = ({
    comment,
    level = 0,
    onReply,
    onLike,
    replyingTo,
    submitReply,
    loading,
    onDelete,
    currentUserId
}) => {
    const [replyContent, setReplyContent] = useState('');

    const handleSubmit = async () => {
        if (!replyContent.trim()) return;
        await submitReply(comment.id, replyContent);
        setReplyContent('');
    };

    return (
        <div className={`group ${level > 0 ? 'mt-4 border-l-2 border-gray-100 pl-4' : ''}`}>
            <div className="flex gap-4">
                <div className={`rounded-full flex items-center justify-center font-bold shrink-0 ${level === 0 ? 'w-10 h-10 bg-purple-100 text-purple-700' : 'w-8 h-8 bg-gray-100 text-gray-600 text-xs'}`}>
                    {comment.userName.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <span className="font-bold mr-2 text-sm">{comment.userName}</span>
                                <span className="text-xs text-gray-500">{timeAgo(comment.createdAt)}</span>
                            </div>
                        </div>
                        <p className="text-gray-700 leading-relaxed mb-3 text-sm">{comment.content}</p>

                        <div className="flex items-center gap-6 text-sm text-gray-500">
                            <button
                                onClick={() => onLike(comment.id)}
                                className="flex items-center gap-1 hover:text-red-500 transition"
                            >
                                <Heart size={14} className={comment.likes > 0 ? "fill-red-50 text-red-500" : ""} />
                                {comment.likes || 0}
                            </button>
                            <button
                                onClick={() => {
                                    onReply(comment.id);
                                    setReplyContent(''); // Reset on toggle
                                }}
                                className="flex items-center gap-1 hover:text-black transition"
                            >
                                <Reply size={14} /> Responder
                            </button>
                            {currentUserId === comment.userId && (
                                <button
                                    onClick={() => onDelete(comment.id, comment.parentId || null)}
                                    className="flex items-center gap-1 hover:text-red-500 transition text-gray-400"
                                    title="Eliminar comentario"
                                >
                                    <Trash2 size={14} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Reply Input */}
                    {replyingTo === comment.id && (
                        <div className="mt-4 flex gap-3 animate-in fade-in slide-in-from-top-2">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={replyContent}
                                    onChange={(e) => setReplyContent(e.target.value)}
                                    placeholder={`Respondiendo a ${comment.userName}...`}
                                    className="w-full p-2 border rounded-md focus:outline-none focus:border-black text-sm"
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSubmit();
                                        }
                                    }}
                                />
                            </div>
                            <button
                                onClick={handleSubmit}
                                disabled={loading || !replyContent.trim()}
                                className="bg-black text-white p-2 rounded-md hover:bg-zinc-800"
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    )}

                    {/* Recursive Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-2">
                            {comment.replies.map(reply => (
                                <CommentItem
                                    key={reply.id}
                                    comment={reply}
                                    level={level + 1}
                                    onReply={onReply}
                                    onLike={onLike}
                                    replyingTo={replyingTo}
                                    submitReply={submitReply}
                                    loading={loading}
                                    onDelete={onDelete}
                                    currentUserId={currentUserId}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export const CommentsSection = ({ targetId }: { targetId: string }) => {
    const { user, fetchComments, addComment, toggleLike, deleteComment } = useStore();
    const { showNotification } = useNotification();

    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadComments();
    }, [targetId]);

    const loadComments = async () => {
        const data = await fetchComments(targetId);
        setComments(buildCommentTree(data));
    };

    // Robust Tree Builder
    const buildCommentTree = (flatComments: Comment[]) => {
        const map: Record<string, Comment> = {};
        const roots: Comment[] = [];

        // 1. Initialize map
        flatComments.forEach(c => {
            map[c.id] = { ...c, replies: [] };
        });

        // 2. Build relationships
        flatComments.forEach(c => {
            if (c.parentId && map[c.parentId]) {
                map[c.parentId].replies!.push(map[c.id]);
            } else {
                roots.push(map[c.id]);
            }
        });

        return roots;
    };

    const handlePostComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            showNotification('Debes iniciar sesión para comentar', 'info');
            return;
        }
        if (!newComment.trim()) return;

        setLoading(true);
        const comment = await addComment(targetId, newComment);
        setLoading(false);

        if (comment) {
            setNewComment('');
            loadComments();
            showNotification('Comentario publicado', 'success');
        }
    };

    const submitReply = async (parentId: string, content: string) => {
        if (!user) {
            showNotification('Debes iniciar sesión para responder', 'info');
            return;
        }

        setLoading(true);
        const comment = await addComment(targetId, content, parentId);
        setLoading(false);

        if (comment) {
            setReplyingTo(null);
            loadComments();
        }
    };

    const handleLike = async (commentId: string) => {
        if (!user) {
            showNotification('Debes iniciar sesión para dar me gusta', 'info');
            return;
        }
        const res = await toggleLike(commentId);
        if (res) {
            loadComments();
        }
    };

    // Calculate total count recursively
    const countComments = (list: Comment[]) => {
        if (!list) return 0;
        return list.reduce((acc, c) => acc + 1 + countComments(c.replies || []), 0);
    };

    const handleDelete = async (commentId: string) => {
        if (window.confirm("¿Seguro que quieres eliminar este comentario?")) {
            setLoading(true);
            const success = await deleteComment(commentId);
            setLoading(false);
            if (success) {
                loadComments();
            }
        }
    };

    return (
        <div className="mt-12 border-t pt-8">
            <h3 className="text-xl font-bold uppercase mb-6 flex items-center gap-2">
                <MessageCircle /> Comentarios ({countComments(comments)})
            </h3>

            {/* Root Post Box */}
            <form onSubmit={handlePostComment} className="mb-8 flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                    {user ? user.name.charAt(0).toUpperCase() : '?'}
                </div>
                <div className="flex-1">
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder={user ? "Escribe un comentario..." : "Inicia sesión para comentar"}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none resize-none bg-gray-50"
                        rows={2}
                        disabled={!user}
                    />
                    <div className="flex justify-end mt-2">
                        <button
                            type="submit"
                            disabled={!user || loading || !newComment.trim()}
                            className="bg-black text-white px-6 py-2 rounded-full text-sm font-bold uppercase disabled:opacity-50 hover:bg-zinc-800 transition"
                        >
                            Publicar
                        </button>
                    </div>
                </div>
            </form>

            <div className="space-y-6">
                {comments.map(comment => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        onReply={(id) => setReplyingTo(id === replyingTo ? null : id)}
                        onLike={handleLike}
                        replyingTo={replyingTo}
                        submitReply={submitReply}
                        loading={loading}
                        onDelete={handleDelete}
                        currentUserId={user?.email}
                    />
                ))}

                {comments.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        Se el primero en comentar.
                    </div>
                )}
            </div>
        </div>
    );
};
