import { useQuery, gql } from '@apollo/client';
import * as MENUS from '../constants/menus';
import { BlogInfoFragment } from '../fragments/GeneralSettings';
import {
  Header,
  Footer,
  Main,
  Container,
  NavigationMenu,
  Hero,
  SEO,
} from '../components';
import { Html } from 'next/document';

export default function Component() {
  const { data } = useQuery(Component.query, {
    variables: Component.variables(),
  });

  const { title: siteTitle, description: siteDescription } =
  data?.generalSettings;
  const { content } = data?.pageBy;
  const primaryMenu = data?.headerMenuItems?.nodes ?? [];
  const footerMenu = data?.footerMenuItems?.nodes ?? [];

  

  return (
    <>
      <SEO title={siteTitle} description={siteDescription} />
      <Header
        title={siteTitle}
        description={siteDescription}
        menuItems={primaryMenu}
      />
      <Main>
        <Container>
          <div dangerouslySetInnerHTML={{ __html: content }}></div>
        </Container>
      </Main>
      <Footer title={siteTitle} menuItems={footerMenu} />
    </>
  );
}

Component.query = gql`
  ${BlogInfoFragment}
  ${NavigationMenu.fragments.entry}
  query GetPageData(
    $headerLocation: MenuLocationEnum
    $footerLocation: MenuLocationEnum
  ) {
    generalSettings {
      ...BlogInfoFragment
    }
    headerMenuItems: menuItems(where: { location: $headerLocation }) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
    pageBy(uri: "/") {
      isFrontPage
      title(format: RENDERED)
      content(format: RENDERED)
    }
    footerMenuItems: menuItems(where: { location: $footerLocation }) {
      nodes {
        ...NavigationMenuItemFragment
      }
    }
  }
`;

Component.variables = () => {
  return {
    headerLocation: MENUS.PRIMARY_LOCATION,
    footerLocation: MENUS.FOOTER_LOCATION,
  };
};
