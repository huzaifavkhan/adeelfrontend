import { MessageSquare, X, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { useLocation } from "react-router-dom";

// Button utility function
const cn = (...classes: (string | undefined)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Button variants
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// Message interface
interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// Enhanced FloatingChatbot props
interface FloatingChatbotProps {
  isLoading?: boolean;
  showDelay?: number;
  hideOnRouteChange?: boolean;
}

const FloatingChatbot = ({ 
  isLoading = false, 
  showDelay = 800,
  hideOnRouteChange = true 
}: FloatingChatbotProps = {}) => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! How can I help you find your dream property today?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Handle visibility based on loading state and route changes
  useEffect(() => {
    if (isLoading) {
      setIsVisible(false);
      setIsOpen(false); // Close chat if it's open during loading
      return;
    }

    // Show chatbot after delay when not loading
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, showDelay);

    return () => clearTimeout(timer);
  }, [isLoading, showDelay]);

  // Handle route changes
  useEffect(() => {
    if (!hideOnRouteChange) return;

    // Hide chatbot immediately when route changes
    setIsVisible(false);
    setIsOpen(false);
    
    // Show chatbot after delay (assuming page has loaded)
    const timer = setTimeout(() => {
      if (!isLoading) {
        setIsVisible(true);
      }
    }, showDelay);
    
    return () => clearTimeout(timer);
  }, [location.pathname, hideOnRouteChange, showDelay, isLoading]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleChat = () => {
    if (isAnimating || !isVisible) return;
    setIsAnimating(true);
    setIsOpen(!isOpen);
    
    // Reset animation state after animation completes
    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  };

  const sendMessage = (e: React.FormEvent | React.MouseEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputText,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Simulate bot response with typing animation
    setTimeout(() => {
      const botMessage: Message = {
        id: Date.now() + 1,
        text: "Thanks for your message! I'm here to help you with property inquiries. What specific property type are you looking for?",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  // Don't render anything if not visible or loading
  if (!isVisible || isLoading) {
    return null;
  }

  return (
    <>
      {/* CSS Animation Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slideInFromBottom {
            from {
              opacity: 0;
              transform: translateY(100px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .message-animation {
            animation: fadeInUp 0.5s ease-out forwards;
          }
          
          .chatbot-entrance {
            animation: slideInFromBottom 0.6s ease-out forwards;
          }
          
          .pulse-ring {
            animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
          }
        `
      }} />
      
      <div className="fixed bottom-6 right-6 z-50 font-sans chatbot-entrance">
        {/* Chat Window */}
        <div className={`absolute bottom-16 right-0 w-80 h-96 transition-all duration-500 ease-in-out transform origin-bottom-right ${
          isOpen 
            ? 'opacity-100 translate-y-0 scale-100 visible' 
            : 'opacity-0 translate-y-8 scale-95 invisible pointer-events-none'
        }`}>
          <div className="w-full h-full bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden backdrop-blur-sm">
            {/* Header with gradient */}
            <div className="bg-gray-800 text-white p-4 flex items-center justify-between relative overflow-hidden">
              {/* Animated background overlay */}
              <div className="absolute inset-0 bg-gray-800 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="flex items-center gap-3 relative z-10">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-semibold text-sm">Property Assistant</div>
                  <div className="text-xs opacity-90 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    Online • Ready to help
                  </div>
                </div>
              </div>
              
              <Button
                onClick={toggleChat}
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 h-8 w-8 transition-all duration-200 relative z-10 hover:rotate-90"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gradient-to-b from-gray-50/30 to-white">
              {messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} message-animation`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div
                    className={`max-w-xs px-4 py-3 rounded-2xl text-sm shadow-sm transition-all duration-300 hover:shadow-md transform hover:-translate-y-0.5 ${
                      message.isUser
                        ? 'bg-gray-600 text-white rounded-br-md'
                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-md'
                    }`}
                  >
                    {message.text}
                  </div>
                </div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start message-animation">
                  <div className="bg-white text-gray-800 border border-gray-100 px-4 py-3 rounded-2xl rounded-bl-md shadow-sm">
                    <div className="flex space-x-1 items-center">
                      <div className="text-xs text-gray-500 mr-2">Typing</div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-100 bg-white/80 backdrop-blur-sm">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage(e)}
                  placeholder="Ask about properties..."
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent text-sm transition-all duration-200 hover:border-gray-300"
                />
                <Button
                  onClick={sendMessage}
                  size="icon"
                  className="bg-gray-800 hover:bg-gray-600 text-white rounded-full w-12 h-12 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110 active:scale-95 group"
                  disabled={!inputText.trim()}
                >
                  <Send className="h-4 w-4 transform group-hover:translate-x-0.5 transition-transform duration-200" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Button with enhanced animations */}
        <div className="relative">
          {/* Pulse rings - only show when closed */}
          {!isOpen && (
            <>
              <div className="absolute inset-0 rounded-full bg-gray-600 opacity-75 animate-ping"></div>
              <div className="absolute inset-0 rounded-full bg-gray-600 opacity-50 animate-ping" style={{ animationDelay: '1s' }}></div>
            </>
          )}
          
          <Button
            onClick={toggleChat}
            className={`relative bg-gray-800 hover:bg-gray-700 text-white rounded-full p-4 shadow-2xl transition-all duration-300 transform hover:scale-110 active:scale-95 group ${
              isOpen ? 'rotate-180' : 'rotate-0'
            }`}
            size="icon"
            aria-label={isOpen ? "Close Chat" : "Open Chat"}
            disabled={isAnimating}
          >
            <div className={`transition-all duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`}>
              {isOpen ? (
                <X className="h-6 w-6 group-hover:rotate-90 transition-transform duration-200" />
              ) : (
                <MessageSquare className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
              )}
            </div>
          </Button>

          {/* Notification badge - only show when closed */}
          {!isOpen && (
            <div className="absolute -top-2 -right-1.5 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-xs font-bold">1</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default FloatingChatbot;