import { motion } from 'motion/react';
import { Calendar, TrendingUp, Award, Sparkles } from 'lucide-react';
import type { Drawing } from './types';
import { useState } from 'react';
import { ArtworkDetailModal } from './ArtworkDetailModal';

interface TimelineEvent {
  date: string;
  type: 'artwork' | 'milestone';
  drawing?: Drawing;
  milestone?: {
    title: string;
    description: string;
    icon: string;
  };
}

export function TimelinePage() {
  const [selectedDrawing, setSelectedDrawing] = useState<Drawing | null>(null);

  // Mock timeline data
  const timelineEvents: TimelineEvent[] = [
    {
      date: 'April 30, 2026',
      type: 'artwork',
      drawing: {
        id: '9',
        imageUrl: 'https://images.unsplash.com/photo-1754239027382-2e145a685108?w=400',
        childName: 'Ava',
        age: 6,
        date: 'April 30, 2026',
        rotation: -0.5,
      },
    },
    {
      date: 'April 28, 2026',
      type: 'milestone',
      milestone: {
        title: '10 Masterpieces Created! 🎉',
        description: 'Sophie has created 10 amazing artworks',
        icon: '🏆',
      },
    },
    {
      date: 'April 27, 2026',
      type: 'artwork',
      drawing: {
        id: '6',
        imageUrl: 'https://images.unsplash.com/photo-1697962176820-b52c00e311f1?w=400',
        childName: 'Liam',
        age: 6,
        date: 'April 27, 2026',
        rotation: 1,
      },
    },
    {
      date: 'April 25, 2026',
      type: 'artwork',
      drawing: {
        id: '5',
        imageUrl: 'https://images.unsplash.com/photo-1676969937951-0501ef745b22?w=400',
        childName: 'Mia',
        age: 8,
        date: 'April 25, 2026',
        rotation: -1.5,
      },
    },
    {
      date: 'April 20, 2026',
      type: 'milestone',
      milestone: {
        title: 'First Rainbow Drawing! 🌈',
        description: 'Emma created her first rainbow masterpiece',
        icon: '🌈',
      },
    },
    {
      date: 'April 20, 2026',
      type: 'artwork',
      drawing: {
        id: '3',
        imageUrl: 'https://images.unsplash.com/photo-1761403935539-0c971c206f25?w=400',
        childName: 'Emma',
        age: 7,
        date: 'April 20, 2026',
        rotation: -1,
      },
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-4"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--sunny-yellow)] to-[var(--mint-green)] flex items-center justify-center">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="font-[var(--font-family-heading)] text-5xl">
                Creative Timeline
              </h1>
              <p className="text-muted-foreground text-lg">
                Track your children's artistic journey over time 📅
              </p>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center gap-3">
              <TrendingUp className="w-10 h-10 text-primary" />
              <div>
                <p className="text-2xl font-[var(--font-family-heading)]">24</p>
                <p className="text-sm text-muted-foreground">Total Artworks</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-secondary/10 to-secondary/5 flex items-center gap-3">
              <Calendar className="w-10 h-10 text-secondary" />
              <div>
                <p className="text-2xl font-[var(--font-family-heading)]">8</p>
                <p className="text-sm text-muted-foreground">This Month</p>
              </div>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-accent/10 to-accent/5 flex items-center gap-3">
              <Award className="w-10 h-10 text-accent-foreground" />
              <div>
                <p className="text-2xl font-[var(--font-family-heading)]">5</p>
                <p className="text-sm text-muted-foreground">Milestones</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-secondary to-accent opacity-30" />

          <div className="space-y-8">
            {timelineEvents.map((event, index) => (
              <motion.div
                key={index}
                className="relative pl-20"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {/* Timeline dot */}
                <div className="absolute left-6 top-4">
                  <div className="w-5 h-5 rounded-full bg-white border-4 border-primary shadow-lg" />
                </div>

                {/* Date label */}
                <div className="text-sm text-muted-foreground mb-2 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{event.date}</span>
                </div>

                {/* Content */}
                {event.type === 'artwork' && event.drawing ? (
                  <motion.div
                    className="bg-white rounded-3xl p-6 shadow-md hover:shadow-2xl transition-all cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedDrawing(event.drawing!)}
                  >
                    <div className="flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden bg-muted flex-shrink-0">
                        <img
                          src={event.drawing.imageUrl}
                          alt={`Drawing by ${event.drawing.childName}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-[var(--font-family-heading)] text-2xl mb-2">
                          New Artwork Created!
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          {event.drawing.childName}, age {event.drawing.age}, created a new
                          masterpiece
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                            {event.drawing.childName}
                          </div>
                          <div className="px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm">
                            Age {event.drawing.age}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : event.type === 'milestone' && event.milestone ? (
                  <div className="bg-gradient-to-br from-[var(--sunny-yellow)]/20 to-[var(--mint-green)]/20 rounded-3xl p-6 border-2 border-[var(--sunny-yellow)]/30">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-2xl flex-shrink-0">
                        {event.milestone.icon}
                      </div>
                      <div>
                        <h3 className="font-[var(--font-family-heading)] text-2xl mb-2">
                          {event.milestone.title}
                        </h3>
                        <p className="text-muted-foreground">{event.milestone.description}</p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </motion.div>
            ))}
          </div>

          {/* End marker */}
          <motion.div
            className="relative pl-20 pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: timelineEvents.length * 0.1 }}
          >
            <div className="absolute left-6 top-12">
              <div className="w-5 h-5 rounded-full bg-gradient-to-br from-primary to-secondary" />
            </div>
            <div className="text-center p-8 rounded-3xl bg-gradient-to-br from-primary/5 to-secondary/5">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
              <p className="text-muted-foreground">
                The creative journey continues...
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedDrawing && (
        <ArtworkDetailModal
          drawing={selectedDrawing}
          onClose={() => setSelectedDrawing(null)}
        />
      )}
    </div>
  );
}
