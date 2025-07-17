// Mock Habit Manager for GitHub Pages Demo
class HabitManager {
    constructor() {
        this.habits = this.loadHabitsFromStorage();
        this.initDemoData();
    }
    
    initDemoData() {
        // Create demo habits if none exist
        if (this.habits.length === 0) {
            this.habits = [
                {
                    id: 1,
                    name: 'Morning Exercise',
                    description: 'Do 30 minutes of exercise every morning',
                    color: '#4CAF50',
                    category: 'Fitness',
                    priority: 'high',
                    icon: '🏃‍♂️',
                    weekly_goal: 7,
                    difficulty: 'medium',
                    tags: 'morning, exercise, health',
                    streak_count: 5,
                    completedThisWeek: 4,
                    created_at: new Date().toISOString()
                },
                {
                    id: 2,
                    name: 'Read for 20 minutes',
                    description: 'Read a book or article for at least 20 minutes',
                    color: '#2196F3',
                    category: 'Learning',
                    priority: 'medium',
                    icon: '📚',
                    weekly_goal: 5,
                    difficulty: 'easy',
                    tags: 'reading, learning, personal growth',
                    streak_count: 3,
                    completedThisWeek: 3,
                    created_at: new Date().toISOString()
                },
                {
                    id: 3,
                    name: 'Meditation',
                    description: 'Practice mindfulness meditation for 10 minutes',
                    color: '#9C27B0',
                    category: 'Mindfulness',
                    priority: 'medium',
                    icon: '🧘‍♀️',
                    weekly_goal: 6,
                    difficulty: 'medium',
                    tags: 'meditation, mindfulness, mental health',
                    streak_count: 2,
                    completedThisWeek: 2,
                    created_at: new Date().toISOString()
                }
            ];
            this.saveHabitsToStorage();
        }
    }
    
    loadHabitsFromStorage() {
        const stored = localStorage.getItem('demo_habits');
        return stored ? JSON.parse(stored) : [];
    }
    
    saveHabitsToStorage() {
        localStorage.setItem('demo_habits', JSON.stringify(this.habits));
    }
    
    async loadHabits() {
        await this.delay(500); // Simulate network delay
        return this.habits;
    }
    
    async createHabit(name, description, color, category, priority, icon, weekly_goal, reminder_time, tags, difficulty) {
        await this.delay(800);
        
        const newHabit = {
            id: Date.now(),
            name,
            description,
            color: color || '#0077cc',
            category: category || 'General',
            priority: priority || 'medium',
            icon: icon || '🎯',
            weekly_goal: weekly_goal || 7,
            reminder_time,
            tags,
            difficulty: difficulty || 'medium',
            streak_count: 0,
            completedThisWeek: 0,
            created_at: new Date().toISOString()
        };
        
        this.habits.push(newHabit);
        this.saveHabitsToStorage();
        
        return { success: true, habit: newHabit };
    }
    
    async updateHabit(id, name, description, color, category, priority, icon, weekly_goal, reminder_time, tags, difficulty) {
        await this.delay(800);
        
        const index = this.habits.findIndex(h => h.id === id);
        if (index !== -1) {
            this.habits[index] = {
                ...this.habits[index],
                name,
                description,
                color,
                category,
                priority,
                icon,
                weekly_goal,
                reminder_time,
                tags,
                difficulty
            };
            this.saveHabitsToStorage();
            return { success: true, habit: this.habits[index] };
        }
        
        return { success: false, message: 'Habit not found' };
    }
    
    async deleteHabit(id) {
        await this.delay(600);
        
        this.habits = this.habits.filter(h => h.id !== id);
        this.saveHabitsToStorage();
        
        return { success: true };
    }
    
    async trackHabit(id, completed, date = null) {
        await this.delay(400);
        
        const habit = this.habits.find(h => h.id === id);
        if (habit) {
            if (completed) {
                habit.completedThisWeek = Math.min(habit.completedThisWeek + 1, habit.weekly_goal);
                habit.streak_count++;
            }
            this.saveHabitsToStorage();
            return { success: true };
        }
        
        return { success: false, message: 'Habit not found' };
    }
    
    async getHabitTracking(id) {
        await this.delay(300);
        
        // Mock tracking data
        const entries = [];
        const today = new Date();
        for (let i = 0; i < 30; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            entries.push({
                date: date.toISOString().split('T')[0],
                completed: Math.random() > 0.3 // 70% completion rate
            });
        }
        
        return entries;
    }

    async getStatistics() {
        await this.delay(400);
        
        const totalHabits = this.habits.length;
        const todayCompletions = Math.floor(totalHabits * 0.6); // Mock 60% completion
        const currentStreak = Math.max(...this.habits.map(h => h.streak_count));
        const weeklyCompletionRate = Math.floor(
            (this.habits.reduce((sum, h) => sum + h.completedThisWeek, 0) / 
             this.habits.reduce((sum, h) => sum + h.weekly_goal, 0)) * 100
        );
        
        return {
            totalHabits,
            todayCompletions,
            currentStreak,
            weeklyCompletionRate
        };
    }

    async getCategories() {
        await this.delay(200);
        
        const categories = [...new Set(this.habits.map(h => h.category))];
        return categories;
    }
    
    // Utility method to simulate network delay
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

const habitManager = new HabitManager();
