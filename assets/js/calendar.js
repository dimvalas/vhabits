class CalendarManager {
    constructor() {
        this.currentDate = new Date();
        this.selectedDate = new Date();
        this.habits = [];
        this.habitEntries = [];
        this.init();
    }

    async init() {
        await this.loadHabits();
        await this.loadHabitEntries();
        this.renderCalendar();
        this.renderTodayHabits();
        this.updateStats();
    }

    async loadHabits() {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch('/api/habits', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                this.habits = await response.json();
            }
        } catch (error) {
            console.error('Error loading habits:', error);
        }
    }

    async loadHabitEntries() {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            // Load entries for all habits
            const entries = [];
            for (const habit of this.habits) {
                const response = await fetch(`/api/habits/${habit.id}/tracking`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const habitEntries = await response.json();
                    entries.push(...habitEntries.map(entry => ({
                        ...entry,
                        habitId: habit.id,
                        habitName: habit.name,
                        habitColor: habit.color
                    })));
                }
            }

            this.habitEntries = entries;
        } catch (error) {
            console.error('Error loading habit entries:', error);
        }
    }

    renderCalendar() {
        const grid = document.getElementById('calendarGrid');
        const monthElement = document.getElementById('currentMonth');
        
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        
        // Update month header
        monthElement.textContent = this.currentDate.toLocaleDateString('en-US', { 
            month: 'long', 
            year: 'numeric' 
        });

        // Calculate first day of month and number of days
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        // Clear grid
        grid.innerHTML = '';

        // Add empty cells for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day empty';
            grid.appendChild(emptyCell);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            
            const date = new Date(year, month, day);
            const dateString = date.toISOString().split('T')[0];
            
            // Check if it's today
            const today = new Date();
            const isToday = date.toDateString() === today.toDateString();
            
            if (isToday) {
                dayElement.classList.add('today');
            }

            // Calculate completion for this day
            const dayCompletion = this.calculateDayCompletion(dateString);
            dayElement.classList.add(dayCompletion.status);

            // Create day content
            const dayNumber = document.createElement('div');
            dayNumber.className = 'day-number';
            dayNumber.textContent = day;
            dayElement.appendChild(dayNumber);

            // Add completion indicator
            if (dayCompletion.percentage > 0) {
                const indicator = document.createElement('div');
                indicator.className = 'completion-indicator';
                indicator.style.width = `${dayCompletion.percentage}%`;
                dayElement.appendChild(indicator);
            }

            // Add habit dots
            const habitDots = document.createElement('div');
            habitDots.className = 'habit-dots';
            
            const dayEntries = this.habitEntries.filter(entry => entry.date === dateString);
            const completedHabits = dayEntries.filter(entry => entry.completed);
            
            completedHabits.slice(0, 4).forEach(entry => {
                const dot = document.createElement('div');
                dot.className = 'habit-dot';
                dot.style.backgroundColor = entry.habitColor;
                dot.title = entry.habitName;
                habitDots.appendChild(dot);
            });

            if (completedHabits.length > 4) {
                const moreDot = document.createElement('div');
                moreDot.className = 'habit-dot more';
                moreDot.textContent = `+${completedHabits.length - 4}`;
                habitDots.appendChild(moreDot);
            }

            dayElement.appendChild(habitDots);

            // Add click handler
            dayElement.addEventListener('click', () => {
                this.selectDate(date);
            });

            grid.appendChild(dayElement);
        }
    }

    calculateDayCompletion(dateString) {
        const dayEntries = this.habitEntries.filter(entry => entry.date === dateString);
        const totalHabits = this.habits.length;
        
        if (totalHabits === 0) {
            return { percentage: 0, status: 'empty' };
        }

        const completedHabits = dayEntries.filter(entry => entry.completed).length;
        const percentage = (completedHabits / totalHabits) * 100;

        let status = 'missed';
        if (percentage === 100) {
            status = 'perfect';
        } else if (percentage >= 75) {
            status = 'good';
        } else if (percentage > 0) {
            status = 'partial';
        }

        return { percentage, status };
    }

    selectDate(date) {
        this.selectedDate = date;
        this.renderCalendar();
        this.renderSelectedDateHabits();
    }

    renderSelectedDateHabits() {
        const dateString = this.selectedDate.toISOString().split('T')[0];
        const container = document.getElementById('todayHabits');
        
        container.innerHTML = '';
        
        if (this.habits.length === 0) {
            container.innerHTML = '<p class="no-habits">No habits found. <a href="habit.html">Create your first habit</a></p>';
            return;
        }

        const header = document.createElement('h4');
        header.textContent = `Habits for ${this.selectedDate.toLocaleDateString()}`;
        container.appendChild(header);

        this.habits.forEach(habit => {
            const entry = this.habitEntries.find(e => e.habitId === habit.id && e.date === dateString);
            const isCompleted = entry && entry.completed;

            const habitElement = document.createElement('div');
            habitElement.className = `habit-quick-item ${isCompleted ? 'completed' : ''}`;
            habitElement.innerHTML = `
                <div class="habit-info">
                    <div class="habit-color" style="background-color: ${habit.color}"></div>
                    <span class="habit-name">${habit.name}</span>
                </div>
                <div class="habit-status">
                    ${isCompleted ? '✅' : '⭕'}
                </div>
            `;

            container.appendChild(habitElement);
        });
    }

    renderTodayHabits() {
        const today = new Date();
        this.selectedDate = today;
        this.renderSelectedDateHabits();
    }

    updateStats() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        
        let totalPossibleCompletions = 0;
        let totalActualCompletions = 0;
        let perfectDays = 0;
        let currentStreak = 0;

        // Calculate monthly stats
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateString = date.toISOString().split('T')[0];
            const dayCompletion = this.calculateDayCompletion(dateString);
            
            totalPossibleCompletions += this.habits.length;
            
            const dayEntries = this.habitEntries.filter(entry => entry.date === dateString);
            const completedHabits = dayEntries.filter(entry => entry.completed).length;
            totalActualCompletions += completedHabits;
            
            if (dayCompletion.status === 'perfect') {
                perfectDays++;
            }
        }

        // Calculate current streak
        const today = new Date();
        let checkDate = new Date(today);
        
        while (checkDate >= firstDay) {
            const dateString = checkDate.toISOString().split('T')[0];
            const dayCompletion = this.calculateDayCompletion(dateString);
            
            if (dayCompletion.percentage >= 75) {
                currentStreak++;
            } else {
                break;
            }
            
            checkDate.setDate(checkDate.getDate() - 1);
        }

        // Update UI
        const monthlyCompletion = totalPossibleCompletions > 0 
            ? Math.round((totalActualCompletions / totalPossibleCompletions) * 100)
            : 0;

        document.getElementById('monthlyCompletion').textContent = `${monthlyCompletion}%`;
        document.getElementById('currentStreak').textContent = currentStreak;
        document.getElementById('perfectDays').textContent = perfectDays;
    }

    navigateMonth(direction) {
        this.currentDate.setMonth(this.currentDate.getMonth() + direction);
        this.renderCalendar();
        this.updateStats();
    }
}

// Navigation functions
function navigateMonth(direction) {
    if (window.calendarManager) {
        window.calendarManager.navigateMonth(direction);
    }
}

// Initialize calendar when page loads
document.addEventListener('DOMContentLoaded', () => {
    window.calendarManager = new CalendarManager();
});
