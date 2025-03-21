export const setFooter = () => {
    const footer = document.querySelector('footer');
    footer.innerHTML = `
    <nav>
        <ul>
          <li class="navItem"><a href="./"><i class="fa fa-home"></i></a></li>
          <li class="navItem"><a href="add"><i class="fa fa-plus"></i></a></li>
          <li class="navItem"><a href="#"><i class="fa fa-calendar-days"></i></a></li>
        </ul>
      </nav>`;
      const path = window.location.pathname;
      const page = path.split("/").pop();
      if (page.includes('index')||page=='') {
        document.querySelector('.fa-home').closest('.navItem').classList.add('active');
      } else if (page.includes('add')) {
        document.querySelector('.fa-plus').closest('.navItem').classList.add('active');
      } else {
        document.querySelector('.fa-calendar-days').closest('.navItem').classList.add('active');
      }
}