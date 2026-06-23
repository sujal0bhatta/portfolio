/* main.js - Portfolio Core Interactivity */

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. PRELOADER
  // ==========================================
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
      // Initialize AOS after preloader ends
      if (typeof AOS !== 'undefined') {
        AOS.init({
          duration: 1000,
          once: true,
          easing: 'ease-out-cubic',
          offset: 100
        });
      }
    });
    
    // Backup fallback in case window load takes too long
    setTimeout(() => {
      preloader.style.opacity = '0';
      preloader.style.visibility = 'hidden';
      if (typeof AOS !== 'undefined') {
        AOS.init({ once: true });
      }
    }, 2500);
  }

  // ==========================================
  // 2. NAV SCROLL EFFECTS & PROGRESS BAR
  // ==========================================
  const header = document.querySelector('.header');
  const scrollProgress = document.getElementById('scroll-progress');
  
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    
    // Header Glassmorphism scroll toggle
    if (scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    // Scroll progress bar calculation
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progress = (scrollY / totalHeight) * 100;
      scrollProgress.style.width = `${progress}%`;
    }
  });

  // ==========================================
  // 3. THEME TOGGLE (Light/Dark Mode)
  // ==========================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  
  // Check user preference
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
    document.body.classList.add('light-theme');
  }
  
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      document.body.classList.toggle('light-theme');
      
      if (document.body.classList.contains('light-theme')) {
        localStorage.setItem('theme', 'light');
      } else {
        localStorage.setItem('theme', 'dark');
      }
    });
  }

  // ==========================================
  // 4. MOBILE DRAWER NAVIGATION
  // ==========================================
  const mobileToggle = document.getElementById('mobile-nav-toggle');
  const navLinksList = document.querySelector('.nav-links');
  const navLinksItems = document.querySelectorAll('.nav-links a');
  
  if (mobileToggle && navLinksList) {
    mobileToggle.addEventListener('click', () => {
      navLinksList.classList.toggle('active');
      const icon = mobileToggle.querySelector('svg');
      if (navLinksList.classList.contains('active')) {
        icon.innerHTML = '<path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>';
      } else {
        icon.innerHTML = '<path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>';
      }
    });
    
    // Close mobile menu on links clicks
    navLinksItems.forEach(link => {
      link.addEventListener('click', () => {
        navLinksList.classList.remove('active');
        const icon = mobileToggle.querySelector('svg');
        icon.innerHTML = '<path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>';
      });
    });
  }

  // ==========================================
  // 5. SCROLL SPY ACTIVE NAV LINK
  // ==========================================
  const sections = document.querySelectorAll('section[id]');
  
  function scrollActiveLink() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const activeLink = document.querySelector(`.nav-links a[href*=${sectionId}]`);
      
      if (activeLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          activeLink.classList.add('active');
        } else {
          activeLink.classList.remove('active');
        }
      }
    });
  }
  
  window.addEventListener('scroll', scrollActiveLink);

  // ==========================================
  // 6. STATS COUNTER ANIMATION
  // ==========================================
  const statNumbers = document.querySelectorAll('.stat-number');
  
  const animateStats = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetNum = parseInt(target.getAttribute('data-target'));
        const speed = 2000; // time in ms
        const increment = targetNum / (speed / 16); // 60fps
        let currentNum = 0;
        
        const updateCount = () => {
          currentNum += increment;
          if (currentNum < targetNum) {
            target.innerText = Math.ceil(currentNum) + '+';
            requestAnimationFrame(updateCount);
          } else {
            target.innerText = targetNum + '+';
          }
        };
        
        updateCount();
        observer.unobserve(target); // Only animate once
      }
    });
  };
  
  const statsObserver = new IntersectionObserver(animateStats, {
    threshold: 0.5
  });
  
  statNumbers.forEach(num => {
    statsObserver.observe(num);
  });

  // ==========================================
  // 7. SKILLS BARS ANIMATION
  // ==========================================
  const skillBars = document.querySelectorAll('.skill-bar-fill');
  
  const fillSkillBars = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const percent = bar.getAttribute('data-width');
        bar.style.width = percent;
        observer.unobserve(bar);
      }
    });
  };
  
  const skillsObserver = new IntersectionObserver(fillSkillBars, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });
  
  skillBars.forEach(bar => {
    skillsObserver.observe(bar);
  });

  // ==========================================
  // 8. TIMELINE CONNECTOR SCROLL PATH
  // ==========================================
  const timelineProgress = document.querySelector('.timeline-line-progress');
  const timelineSection = document.getElementById('experience');
  
  if (timelineProgress && timelineSection) {
    window.addEventListener('scroll', () => {
      const rect = timelineSection.getBoundingClientRect();
      const sectionHeight = timelineSection.offsetHeight;
      const screenHeight = window.innerHeight;
      
      // Calculate how far inside the section the user has scrolled
      let progress = 0;
      if (rect.top < screenHeight / 2) {
        const scrolledDistance = (screenHeight / 2) - rect.top;
        progress = Math.min((scrolledDistance / (sectionHeight - screenHeight / 2)) * 100, 100);
      }
      
      timelineProgress.style.height = `${Math.max(progress, 0)}%`;
    });
  }

});
