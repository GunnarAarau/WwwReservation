// File: ReservationLayoutSvg.js
// Date: 2024-11-22
// Authors: Gunnar Lidén

// Content
// =======
//
// Reservation layout SVG classes and functions
//


///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// Start Class Layout Svg //////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

// Class that creates all SVG code for the reservation layout HTML file
class LayoutSvg
{
    // Creates the instance of the class
    // i_layout_xml: Object for a reservation layout XML file. 
    constructor(i_layout_xml) 
    {
        // Member variables
        // ================

       // Layout XML object
       this.m_layout_xml = i_layout_xml;

       // The conversion factor mm to pixel
       this.m_scale_dimension = -0.123456789;

       // Style for the SVH element
       this.m_style_block_svg =  ' ' + 'style="fill:rgb(255,255,255);stroke-width:3;stroke:rgb(0,0,0);margin-top:0px; padding:0px" ';

       // All SVG code from this class
       this.m_svg_code = '';    
	   
       // Create (construct) the SVG code
       this.execute();

    } // constructor

    // Create (construct) the SVG code
    // 1. Calculate conversion factor mm to pixel. Create premises SVG object.
    // 2. Add SVG start line. Call of PremisesSvg.startLineSvg
    // 3. Add premises SVG to m_svg_code. Call of PremisesSvg.get.


     // n. Add SVG end line. Call of PremisesSvg.endLineSvg
    execute()
    {
        if (this.m_layout_xml == null)
        {
            alert("LayoutSvg.execute Layout XML object is null");

            return;
        }

        this.m_scale_dimension = this.millimeterToPixel(this.m_layout_xml);

        this.m_svg_code = '';

        this.m_svg_code = this.m_svg_code + this.startLineSvg();

        var premises_svg = new PremisesSvg(this.m_layout_xml, this.m_scale_dimension);

        this.m_svg_code = this.m_svg_code + premises_svg.get();

        var stage_svg = new StageSvg(this.m_layout_xml, this.m_scale_dimension);

        this.m_svg_code = this.m_svg_code + stage_svg.get();

        var cashier_data = new CashierSvg(this.m_layout_xml, this.m_scale_dimension);

        this.m_svg_code = this.m_svg_code + cashier_data.get();

        var doors_svg = new DoorSvg(this.m_layout_xml, this.m_scale_dimension);

        this.m_svg_code = this.m_svg_code + doors_svg.get();

        var tables_svg = new TableSvg(this.m_layout_xml, this.m_scale_dimension);

        this.m_svg_code = this.m_svg_code + tables_svg.get();


 
        this.m_svg_code = this.m_svg_code + this.endLineSvg();

    } // execute

    // Get all SVG code for the body of the output HTML files
    get()
    {
        return this.m_svg_code;

    } // get

    // Returns the start line for the SVG element (block) <svg ......>
    startLineSvg()
    {
        var premises_data = getPremisesDataFromXml(this.m_layout_xml);
        var premises_width = premises_data.getWidth(); 
        var premises_height = premises_data.getHeight();
        var premises_width_pixel = parseInt(premises_width*this.m_scale_dimension);
        var premises_height_pixel = parseInt(premises_height*this.m_scale_dimension);

        var ret_svg = '';
	
        var svg_svg = '<svg id= "id_block_svg" height=' + premises_height_pixel + ' width=' + premises_width_pixel 
                                + this.m_style_block_svg + ' >'
       
        ret_svg = ret_svg + svg_svg + '\n';
       
        return ret_svg;

    } // startLineSvg

    // Returns the end line for the SVG element (block) </svg>
    endLineSvg()
    {
        return '</svg>';	

    } // startLineSvg

    // Fonts, font sizes and colors (styles)
    static fontBig()
    {
        var font_big = ' font-family="arial" font-size="50px" fill=';

        return font_big;

    } // fontBig

    static fontMid()
    {
        var font_mid = ' font-family="arial" font-size="30px" fill=';

        return font_mid;

    } // fontMid

    static colorJazzLiveAarau()
    {
        var color_jazz_live_aarau = ' "rgb(255, 0, 40)" ';

        return color_jazz_live_aarau;

    } // colorJazzLiveAarau

/*
// Fonts, font sizes and colors (styles)


var g_font_button = ' font-family="arial" font-size="22px" ';
var g_style_button = ' style="cursor: pointer;fill:white;stroke-width:1;stroke:black" ';
var g_style_button_blue = ' style="fill:blue;stroke-width:1;stroke:black" ';
var g_style_button_purple = ' style="fill:purple;stroke-width:1;stroke:black" ';
var g_style_cursor_pointer = ' style="cursor: pointer; "';

var g_prompt_text_color = "yellow";
var g_active_mode_color = "magenta";
var g_color_white = "white";
var g_color_silver = "silver";
var g_color_light_blue = "LightSkyBlue";
var g_color_indigo = "Indigo";
var g_color_green_yellow = "GreenYellow";
var g_color_yellow = "Yellow";

var g_color_free_seat = "white"; // Blue rgb(142, 181, 242) Light green rgb(175, 234, 152)
var g_color_reserved_seat = "red";
var g_color_seat_circle = "black";

*/

    // Returns the conversion factor mm to pixel
    millimeterToPixel(i_layout_xml)
    {
        var ret_scale_factor = -0.123456789;

        var premises_data = getPremisesDataFromXml(i_layout_xml);

        var premises_width = premises_data.getWidth();

        var max_width_pixels = premises_data.getMaxWidthPixel(); 

        if (premises_width > 0)
        {
            ret_scale_factor = max_width_pixels/premises_width;
        }
        else
        {
            alert("LayoutSvg.millimeterToPixel  premises_width <= 0");
        }

        return ret_scale_factor;

    } // millimeterToPixel

} // LayoutSvg

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// End Class Layout Svg ////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// Start Class Premises Svg ////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

// Class that creates all premises SVG code for the reservation layout HTML files
class PremisesSvg
{
    // Creates the instance of the class
    // i_layout_xml: Object for a reservation layout XML file. 
	// i_scale_dimension: The conversion factor mm to pixel
    constructor(i_layout_xml, i_scale_dimension) 
    {
        // Member variables
        // ================

       // Layout XML object
       this.m_layout_xml = i_layout_xml;

       // The conversion factor mm to pixel
       this.m_scale_dimension = i_scale_dimension;

       this.m_style_wall = ' style="fill:rgb(222, 223, 224);stroke-width:1;stroke:black"';
       this.m_style_wall_black = ' style="fill:rgb(0, 0, 0);stroke-width:1;stroke:black"';

       // All SVG code from this class
       this.m_svg_code = '';
	   
       // Create (construct) the SVG code
       this.execute();

    } // constructor

    // Create (construct) the SVG code
    execute()
    {
        if (this.m_layout_xml == null)
        {
            alert("PremisesSvg.execute Layout XML object is null");

            return;
        }

        var premises_data = getPremisesDataFromXml(this.m_layout_xml);
        var premises_width = premises_data.getWidth(); 
        var premises_height = premises_data.getHeight();
        var wall_thickness = premises_data.getWallThickness();
        var organizer_name = premises_data.getOrganizerName();
        var organizer_text_logo = premises_data.getOrganizerTextLogo();
       
        // Convert premises dimensions from mm to pixel
        var premises_width_pixel = parseInt(premises_width*this.m_scale_dimension);
        var premises_height_pixel = parseInt(premises_height*this.m_scale_dimension);
        var wall_thickness_pixel = parseInt(wall_thickness*this.m_scale_dimension);
        
        var premises_svg = '';
        
        // Rectangle defining the premises
        var rectangle_svg = '<rect width=' + premises_width_pixel + ' height=' + premises_height_pixel +  ' />';
        premises_svg = premises_svg + rectangle_svg + '\n';
     
        // Position and dimension of the left wall	
        var wall_left_x_pixel = 0;
        var wall_left_y_pixel = 0;
        var wall_left_width_pixel = wall_thickness_pixel;
        var wall_left_height_pixel = premises_height_pixel;
       
        // Rectangle defining the left wall
        rectangle_svg = '<rect ' + ' x=' + wall_left_x_pixel + ' y=' + wall_left_y_pixel
          + ' width=' + wall_left_width_pixel + ' height=' + wall_left_height_pixel     
          + this.m_style_wall +  ' />';
        premises_svg = premises_svg + rectangle_svg + '\n';
        
        // Position and dimension of the right wall		
        var wall_right_x_pixel = premises_width_pixel - wall_thickness_pixel;
        var wall_right_y_pixel = 0;
        var wall_right_width_pixel = wall_thickness_pixel;
        var wall_right_height_pixel = premises_height_pixel;
    
        // Rectangle defining the right wall
        rectangle_svg = '<rect ' + ' x=' + wall_right_x_pixel + ' y=' + wall_right_y_pixel
          + ' width=' + wall_right_width_pixel + ' height=' + wall_right_height_pixel     
          + this.m_style_wall +  ' />';
        premises_svg = premises_svg + rectangle_svg + '\n';   
    
        // Position and dimension of the upper wall	(height = 3 X wall thickness)	  
        var wall_upper_x_pixel = 0;
        var wall_upper_y_pixel = 0;
        var wall_upper_width_pixel = premises_width_pixel;
        var wall_upper_height_pixel = 3*wall_thickness_pixel;
    
        // Rectangle defining the upper wall (color black)	
        rectangle_svg = '<rect ' + ' x=' + wall_upper_x_pixel + ' y=' + wall_upper_y_pixel
          + ' width=' + wall_upper_width_pixel + ' height=' + wall_upper_height_pixel     
          + this.m_style_wall_black +  ' />';
        premises_svg = premises_svg + rectangle_svg + '\n'; 	  
    
        // Position and dimension of the lower wall	
        var wall_lower_x_pixel = 0;
        var wall_lower_y_pixel = premises_height_pixel - wall_thickness_pixel;
        var wall_lower_width_pixel = premises_width_pixel;
        var wall_lower_height_pixel = wall_thickness_pixel;
    
        // Rectangle defining the lower wall
        rectangle_svg = '<rect ' + ' x=' + wall_lower_x_pixel + ' y=' + wall_lower_y_pixel
          + ' width=' + wall_lower_width_pixel + ' height=' + wall_lower_height_pixel     
          + this.m_style_wall +  ' />';
        premises_svg = premises_svg + rectangle_svg + '\n';
        
        // 	JAZZ live AARAU text logo position
        var jazz_text_x_pixel = wall_upper_x_pixel + parseInt(wall_upper_width_pixel*0.28);
        var jazz_text_y_pixel = wall_upper_y_pixel + wall_upper_height_pixel - parseInt(wall_upper_height_pixel*0.96);
        
        // JAZZ live AARAU text object
        var text_svg = '<text x=' + jazz_text_x_pixel + ' y=' + jazz_text_y_pixel + 
                  LayoutSvg.fontBig() + LayoutSvg.colorJazzLiveAarau() + '>' + 
                  organizer_name + '</text>';
        // premises_svg = premises_svg + text_svg + '\n';   
        
        var image_width = '400px';
        var image_height = '40px';
        var image_file = organizer_text_logo;
        
        var image_svg = '<image x= ' + jazz_text_x_pixel + ' y= ' + jazz_text_y_pixel + 
                        ' width=' + image_width + ' height=' + image_height + 
                        ' xlink:href=' +image_file + '>' +
                        ' <title>'+ organizer_name +' Text Logo</title> ' + 
                        ' </image>';	
        premises_svg = premises_svg + image_svg + '\n'; 

        this.m_svg_code = premises_svg;
 
    } // execute

    // Get all SVG code for the body of the output HTML files
    get()
    {
        return this.m_svg_code;

    } // get

} // PremisesSvg

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// End Class Premises Svg //////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// Start Class Stage Svg ///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

// Class that creates all stage SVG code for the reservation layout HTML files
class StageSvg
{
    // Creates the instance of the class
    // i_layout_xml: Object for a reservation layout XML file. 
	// i_scale_dimension: The conversion factor mm to pixel
    constructor(i_layout_xml, i_scale_dimension) 
    {
        // Member variables
        // ================

       // Layout XML object
       this.m_layout_xml = i_layout_xml;

       // The conversion factor mm to pixel
       this.m_scale_dimension = i_scale_dimension;

       // All SVG code from this class
       this.m_svg_code = '';
	   
       // Create (construct) the SVG code
       this.execute();

    } // constructor

    // Create (construct) the SVG code
    execute()
    {
        if (this.m_layout_xml == null)
        {
            alert("StageSvg.execute Layout XML object is null");

            return;
        }
    
        // Get stage data from the layout XML file    
        var stage_data = getStageDataFromXml(this.m_layout_xml);

        var stage_upper_left_x = stage_data.getUpperLeftX();
        var stage_upper_left_y = stage_data.getUpperLeftY();
        var stage_image = stage_data.getImage();
        var stage_image_width = stage_data.getImageWidth();
        var stage_image_height = stage_data.getImageHeight()
        
        var stage_width = stage_data.getWidth();
        var stage_height = stage_data.getHeight();
        var stage_text = stage_data.getText();
        var stage_color = stage_data.getColor();
        var stage_stroke_color = stage_data.getStrokeColor();
        var stage_stroke_width = stage_data.getStrokeWidth();
        var stage_text_rel_x_procent = stage_data.getTextRelXProcent();
        var stage_text_rel_y_procent = stage_data.getTextRelYProcent();
        var stage_text_color = stage_data.getTextColor(); 
        
        // Convert from mm to pixel
        var stage_width_pixel = parseInt(stage_width*this.m_scale_dimension);  
        var stage_height_pixel = parseInt(stage_height*this.m_scale_dimension); 
        var stage_upper_left_x_pixel = parseInt(stage_upper_left_x*this.m_scale_dimension); 
        var stage_upper_left_y_pixel = parseInt(stage_upper_left_y*this.m_scale_dimension);

        var state_svg = '';

        // Draw the rectangle representing the stage defined by a relative value
        var rect_svg = '<rect ' + ' x=' + stage_upper_left_x_pixel + ' y=' + stage_upper_left_y_pixel
        + ' width=' + stage_width_pixel + ' height=' + stage_height_pixel     
        + ' style="fill:' + stage_color + ';stroke-width:' + stage_stroke_width + ';stroke:' + stage_stroke_color + '"' +  ' />';
        // state_svg = state_svg + rect_svg + '\n';

        // The X position for the stage text defined by a relative value
        var text_x = stage_width;
        text_x = text_x*stage_text_rel_x_procent;
        text_x = text_x/100.0;
        text_x = text_x + parseInt(stage_upper_left_x);

        // The Y position for the stage text defined by a relative value	
        var text_y = stage_height;
        text_y = text_y*stage_text_rel_y_procent;
        text_y = text_y/100.0;
        text_y = text_y + parseInt(stage_upper_left_y);
        
        // Position converted to pixels
        var text_x_pixel = parseInt(text_x*this.m_scale_dimension);
        var text_y_pixel = parseInt(text_y*this.m_scale_dimension);

        // Stage text object
        var text_svg = '<text x=' + text_x_pixel + ' y=' + text_y_pixel 
                    + LayoutSvg.fontBig() + stage_text_color + 
                    '>' + stage_text + '</text>';
        // state_svg = state_svg + text_svg + '\n';
        
        // Stage image object	
        var image_x_pixel = stage_upper_left_x_pixel + 8;
        var image_y_pixel = stage_upper_left_y_pixel - 25;
                        
        var stage_image_svg = '<image x= ' + image_x_pixel + ' y= ' + image_y_pixel + 
                        ' width=' + stage_image_width + ' height=' + stage_image_height + 
                        ' xlink:href=' + stage_image + '>' +
                        ' <title>Bühne</title> ' + 
                        ' </image>';
                        
        state_svg = state_svg + stage_image_svg + '\n'; 

        this.m_svg_code = state_svg;
 
    } // execute

    // Get all SVG code for the body of the output HTML files
    get()
    {
        return this.m_svg_code;

    } // get

} // StageSvg

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// End Class Stage Svg /////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// Start Class Cashier Svg /////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

// Class that creates all cashier SVG code for the reservation layout HTML files
class CashierSvg
{
    // Creates the instance of the class
    // i_layout_xml: Object for a reservation layout XML file. 
	// i_scale_dimension: The conversion factor mm to pixel
    constructor(i_layout_xml, i_scale_dimension) 
    {
        // Member variables
        // ================

       // Layout XML object
       this.m_layout_xml = i_layout_xml;

       // The conversion factor mm to pixel
       this.m_scale_dimension = i_scale_dimension;
      
       // All SVG code from this class
       this.m_svg_code = '';
	   
       // Create (construct) the SVG code
       this.execute();

    } // constructor

    // Create (construct) the SVG code
    execute()
    {
        if (this.m_layout_xml == null)
        {
            alert("CashierSvg.execute Layout XML object is null");

            return;
        }

       // Get cashier data from the layout XML file    
        var cashier_data = getCashierDataFromXml(this.m_layout_xml);	
        var cashier_upper_left_x = cashier_data.getUpperLeftX();
        var cashier_upper_left_y = cashier_data.getUpperLeftY();
        var cashier_image =        cashier_data.getImage();		
        var cashier_image_width =  cashier_data.getImageWidth();
        var cashier_image_height = cashier_data.getImageHeight();	
        
        var cashier_upper_left_x_pixel = parseInt(cashier_upper_left_x*this.m_scale_dimension); 
        var cashier_upper_left_y_pixel = parseInt(cashier_upper_left_y*this.m_scale_dimension);

        var cashier_svg = '';

        // Cash desk image object	
        var cashier_image_svg = '<image x= ' + cashier_upper_left_x_pixel + ' y= ' + cashier_upper_left_y_pixel + 
                        ' width=' + cashier_image_width + ' height=' + cashier_image_height + 
                        ' xlink:href=' + cashier_image + '>' +
                        ' <title>Kasse</title> ' + 
                        ' </image>';
                        
        cashier_svg = cashier_svg + cashier_image_svg + '\n'; 

        this.m_svg_code = cashier_svg;
 
    } // execute

    // Get all SVG code for the body of the output HTML files
    get()
    {
        return this.m_svg_code;

    } // get

} // CashierSvg

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// End Class Cashier Svg ///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// Start Class Door Svg ////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

// Class that creates all doors SVG code for the reservation layout HTML files
class DoorSvg
{
    // Creates the instance of the class
    // i_layout_xml: Object for a reservation layout XML file. 
	// i_scale_dimension: The conversion factor mm to pixel
    constructor(i_layout_xml, i_scale_dimension) 
    {
        // Member variables
        // ================

       // Layout XML object
       this.m_layout_xml = i_layout_xml;

       // The conversion factor mm to pixel
       this.m_scale_dimension = i_scale_dimension;

       //QQthis.m_style_wall = ' style="fill:rgb(222, 223, 224);stroke-width:1;stroke:black"';
      

       // All SVG code from this class
       this.m_svg_code = '';
	   
       // Create (construct) the SVG code
       this.execute();

    } // constructor

    // Create (construct) the SVG code
    execute()
    {
        if (this.m_layout_xml == null)
        {
            alert("DoorSvg.execute Layout XML object is null");

            return;
        }

       // Get data for all doors from the layout XML file  
       var door_data_array = getDoorDataArrayFromXml(this.m_layout_xml);  

       var n_doors = door_data_array.length;
    

        var all_doors_svg = '';

        for (var door_index=0; door_index < n_doors; door_index++)
        {
            var door_data = door_data_array[door_index];

            all_doors_svg = all_doors_svg + this.oneDoor(door_data);
        }

        this.m_svg_code = all_doors_svg;
 
    } // execute

    // Returns SVG code for one door
    oneDoor(i_door_data)
    {
        // Get door data from the layout XML file 
        var door_type = i_door_data.getType();
        var door_position = i_door_data.getPosition();
        var door_height = i_door_data.getHeight();
        var door_text = i_door_data.getText();
        
        var door_image = i_door_data.getImage();
        var door_image_width_pixel = i_door_data.getImageWidth();
        var door_image_height_pixel = i_door_data.getImageHeight();	
        
        // Convert door dimensions from mm to pixel
        var door_position_pixel = parseInt(door_position*this.m_scale_dimension);
        var door_height_pixel = parseInt(door_height*this.m_scale_dimension);

        // Get premises data from the layout XML file 
        var premises_data = getPremisesDataFromXml(this.m_layout_xml);
        var premises_width = premises_data.getWidth(); 
        var premises_height = premises_data.getHeight();
        var wall_thickness = premises_data.getWallThickness();
       
        // Convert premises dimensions from mm to pixel
        var premises_width_pixel = parseInt(premises_width*this.m_scale_dimension);
        var premises_height_pixel = parseInt(premises_height*this.m_scale_dimension);
        var wall_thickness_pixel = parseInt(wall_thickness*this.m_scale_dimension);        


        var door_svg = '';	
        
    
        if ("right" == door_type)
        {
            var right_coordinate_x_pixel = premises_width_pixel - wall_thickness_pixel;
            var right_coordinate_y_pixel = door_position_pixel;
            var right_width_pixel = premises_width_pixel;
            var right_height_pixel = door_height_pixel;
            
            //var door_right_svg = '<rect ' + ' x=' + right_coordinate_x_pixel + ' y=' + right_coordinate_y_pixel +
            //                    ' width=' + right_width_pixel + ' height=' + right_height_pixel + 
            //                    ' style="fill:white;stroke-width:1;stroke:white"' +  ' />';
                            
            // door_svg  = door_svg + door_right_svg + '\n';
    
            //var right_text_x_pixel	= right_coordinate_x_pixel +  4;
            //var right_text_y_pixel	= right_coordinate_y_pixel +  4;
        
            //var text_right_svg = '<text x=' + right_text_x_pixel + ' y=' + right_text_y_pixel + 
            //                     ' transform="rotate(90, ' + right_text_x_pixel + ',' + + right_text_y_pixel + ')"' +
            //                     ' font-family="arial" font-size="25px" fill=' + g_table_text_color + '>' + door_text + '</text>';
                        
            // door_svg  = door_svg + text_right_svg + '\n';
            
            // Right door image object	
            var right_image_x_pixel = premises_width_pixel - 2 * wall_thickness_pixel;
            var right_image_y_pixel = door_position_pixel;
                        
            var right_image_svg = '<image x= ' + right_image_x_pixel + ' y= ' + right_image_y_pixel + 
                        ' width=' + door_image_width_pixel + ' height=' + door_image_height_pixel + 
                        ' xlink:href=' + door_image + '>' +
                        ' <title>Tür</title> ' + 
                        ' </image>';
                        
            door_svg = door_svg + right_image_svg + '\n'; 		
               
        } // upper

        if ("lower" == door_type)
        {
            var lower_coordinate_x_pixel = door_position_pixel;
            var lower_coordinate_y_pixel = premises_height_pixel - wall_thickness_pixel;
            var lower_width_pixel = door_height_pixel;
            var lower_height_pixel = premises_width_pixel;
            
            //var door_lower_svg = '<rect ' + ' x=' + lower_coordinate_x_pixel + ' y=' + lower_coordinate_y_pixel
            //   + ' width=' + lower_width_pixel + ' height=' + lower_height_pixel     
            //   + ' style="fill:white;stroke-width:1;stroke:white"' +  ' />'
            
            // door_svg  = door_svg + door_lower_svg + '\n';		
    
            //var lower_text_x_pixel	= lower_coordinate_x_pixel +  4;
            //var lower_text_y_pixel	= lower_coordinate_y_pixel + wall_thickness_pixel - 4;
    
            //var text_lower_svg = '<text x=' + lower_text_x_pixel + ' y=' + lower_text_y_pixel 
            //+ ' transform="rotate(0, ' + lower_text_x_pixel + ',' + lower_text_y_pixel + ')"' + 
            //' font-family="arial" font-size="25px" fill=' + g_table_text_color + '>' + door_text + '</text>'
            
            // door_svg  = door_svg + text_lower_svg + '\n';	
    
            // Lower door image object	
            var lower_image_x_pixel = lower_coordinate_x_pixel;
            var lower_image_y_pixel = lower_coordinate_y_pixel - wall_thickness_pixel;
                        
            var lower_image_svg = '<image x= ' + lower_image_x_pixel + ' y= ' + lower_image_y_pixel + 
                        ' width=' + door_image_width_pixel + ' height=' + door_image_height_pixel + 
                        ' xlink:href=' + door_image + '>' +
                        ' <title>Tür</title> ' + 
                        ' </image>';
                        
            door_svg = door_svg + lower_image_svg + '\n'; 		
            
        } // lower


        return door_svg;

    } // oneDoor

    // Get all SVG code for the body of the output HTML files
    get()
    {
        return this.m_svg_code;

    } // get

} // DoorSvg

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// End Class Door Svg //////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// Start Class Table Svg ///////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

// Class that creates all table SVG code for the reservation layout HTML files
class TableSvg
{
    // Creates the instance of the class
    // i_layout_xml: Object for a reservation layout XML file. 
	// i_scale_dimension: The conversion factor mm to pixel
    constructor(i_layout_xml, i_scale_dimension) 
    {
        // Member variables
        // ================

       // Layout XML object
       this.m_layout_xml = i_layout_xml;

       // The conversion factor mm to pixel
       this.m_scale_dimension = i_scale_dimension;

       this.m_color = '';
       this.m_stroke_color = '';
       this.m_stroke_width  = '';
       this.m_text_rel_x_procent  = '';
       this.m_text_rel_y_procent = '';
       this.m_text_color  = '';
      

       // All SVG code from this class
       this.m_svg_code = '';
	   
       // Create (construct) the SVG code
       this.execute();

    } // constructor

    // Create (construct) the SVG code
    // 1. Set the general table properties. Call of TableSvg.setGeneralData
    // 2. Get all groups. Call of getGroupDataArrayFromXml.
    // 3. Loop for all groups
    // 3.1 Get tables for the current group. Call of GroupData.get Tables
    // 3.2 Loop for all group tables
    // 3.2.1 Get and add code to m_svg_code. Call of TableSvg.oneTable
    //
    // Please note that the group information not yet is used, i.e. no group
    // SVG elemnts are created. This means that it right now would be possible
    // to use the function getTableDataArrayFromXml and make one loop for all
    // tables.
    // The implemented two loops (groups and tables) is a preparation for the
    // future. Geometry (SVG) elements may be implemnted that shows the groups-
    // For instance group of tables and groups of seat rows.
    execute()
    {
        if (this.m_layout_xml == null)
        {
            alert("TableSvg.execute Layout XML object is null");

            return;
        }

        var all_tables_svg = '';

        this.setGeneralData();

        var group_data_array = getGroupDataArrayFromXml(this.m_layout_xml);

        var n_groups = group_data_array.length;

        for (var index_group=0; index_group < n_groups; index_group++)
        {
            var group_data = group_data_array[index_group];

            var table_array = group_data.getTables();

            var n_tables = table_array.length;

            for (var index_table=0; index_table < n_tables; index_table++)
            {
                var table_data = table_array[index_table];

                all_tables_svg = all_tables_svg + this.oneTable(table_data);

            } // index_table

        } // index_group


        this.m_svg_code = all_tables_svg;
 
    } // execute

    // Set the general table properties from the layout XML file
    setGeneralData()
    {
        var general_data = getGeneralTableDataFromXml(this.m_layout_xml);
        this.m_color =              general_data.getColor();
        this.m_stroke_color =       general_data.getStrokeColor();
        this.m_stroke_width =       general_data.getStrokeWidth();
        this.m_text_rel_x_procent = general_data.getTextRelXProcent();
        this.m_text_rel_y_procent = general_data.getTextRelYProcent();
        this.m_text_color =         general_data.getTextColor(); 

    } // setGeneralData


    // Returns SVG code for one table
    oneTable(i_table_data)
    {
        // Get table data from the layout XML file 
        var table_number =            i_table_data.getNumber();
        var upper_left_x =            i_table_data.getUpperLeftX();
        var upper_left_y =            i_table_data.getUpperLeftY();
        var table_width =             i_table_data.getWidth();
        var table_height =            i_table_data.getHeight();
        var table_text =              i_table_data.getText();
        var number_left_right_seats = i_table_data.getNumberLeftRightSeats();
        var seat_upper =              i_table_data.getSeatUpper();
        var seat_lower =              i_table_data.getSeatLower();


		var table_svg = '';

        table_svg = table_svg + this.tableRectangle(table_width, table_height, upper_left_x, upper_left_y);

        table_svg = table_svg + this.tableText(table_width, table_height, upper_left_x, upper_left_y, table_number);

        return table_svg;

    } // oneTable

    // Returns SVG code for a table rectanle
    tableRectangle(i_table_width, i_table_height, i_upper_left_x, i_upper_left_y)
    {
        var ret_table_rect_svg = '';
        
        var table_width_pixel = parseInt(i_table_width*this.m_scale_dimension);  
        var table_height_pixel = parseInt(i_table_height*this.m_scale_dimension); 
        var table_upper_left_x_pixel = parseInt(i_upper_left_x*this.m_scale_dimension); 
        var table_upper_left_y_pixel = parseInt(i_upper_left_y*this.m_scale_dimension);
    
        var rect_svg = '<rect ' + ' x=' + table_upper_left_x_pixel + ' y=' + table_upper_left_y_pixel
                        + ' width=' + table_width_pixel + ' height=' + table_height_pixel     
                        + ' style="fill:' + this.m_color + ';stroke-width:' + this.m_stroke_width + ';stroke:' + this.m_stroke_color + '"' +  ' />';

        ret_table_rect_svg = ret_table_rect_svg + rect_svg;

        ret_table_rect_svg = ret_table_rect_svg + '\n';
        
        return ret_table_rect_svg;
        
    } // tableRectangle


    // Returns SVG code for the table text
    tableText(i_table_width, i_table_height, i_upper_left_x, i_upper_left_y, i_table_number)
    {
        var ret_table_text = '';
        
        var text_x = i_table_width;
        text_x = text_x*this.m_text_rel_x_procent;
        text_x = text_x/100.0;
        text_x = text_x + parseInt(i_upper_left_x);
       
        var text_y = i_table_height;
        text_y = text_y*this.m_text_rel_y_procent;
        text_y = text_y/100.0;
        text_y = text_y + parseInt(i_upper_left_y);
        
        var text_x_pixel = parseInt(text_x*this.m_scale_dimension);
        var text_y_pixel = parseInt(text_y*this.m_scale_dimension);
    
        var text_svg = '<text x=' + text_x_pixel + ' y=' + text_y_pixel + ' fill=' + 
            this.m_text_color + '>' + i_table_number + '</text>';

        ret_table_text = ret_table_text + text_svg;

        ret_table_text = ret_table_text + '\n';
        
        return ret_table_text;
        
    } // tableText

    // Returns SVG code for all the table seats (circles)
    allSeats()
    {

    } // allSeats

    // Get all SVG code for the body of the output HTML files
    get()
    {
        return this.m_svg_code;

    } // get

} // TableSvg

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////// End Class Table Svg /////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
